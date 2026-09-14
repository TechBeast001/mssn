import {
  Member,
  AcademicSession,
  Executive,
  Committee,
  EventItem,
  Article,
  GalleryItem,
  FAQItem,
  DonationCause,
  DonationRecord,
  AdminUser,
  ActivityLog,
  SiteContent,
  CertificateData,
  ELibraryItem
} from '../types';
import {
  INITIAL_SESSIONS,
  INITIAL_ADMINS,
  INITIAL_COMMITTEES,
  INITIAL_EXECUTIVES,
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_ARTICLES,
  INITIAL_GALLERY,
  INITIAL_FAQS,
  INITIAL_CAUSES,
  INITIAL_DONATIONS,
  INITIAL_LOGS,
  INITIAL_SITE_CONTENT,
  INITIAL_ELIBRARY
} from '../data/mockDatabase';
import {
  db,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from './firebase';
import { compressDataUrl } from '../utils/imageUtils';

const STORAGE_KEYS = {
  SESSIONS: 'mssnfud_sessions_v1',
  ADMINS: 'mssnfud_admins_v1',
  CURRENT_ADMIN: 'mssnfud_current_admin_v1',
  COMMITTEES: 'mssnfud_committees_v1',
  EXECUTIVES: 'mssnfud_executives_v1',
  MEMBERS: 'mssnfud_members_v1',
  EVENTS: 'mssnfud_events_v1',
  ARTICLES: 'mssnfud_articles_v1',
  GALLERY: 'mssnfud_gallery_v1',
  FAQS: 'mssnfud_faqs_v1',
  CAUSES: 'mssnfud_causes_v1',
  DONATIONS: 'mssnfud_donations_v1',
  LOGS: 'mssnfud_logs_v1',
  SITE_CONTENT: 'mssnfud_site_content_v1',
  CERTIFICATES: 'mssnfud_certificates_v1',
  ELIBRARY: 'mssnfud_elibrary_v1'
};

// In-memory synced state
let inMemoryStore = {
  sessions: INITIAL_SESSIONS,
  admins: INITIAL_ADMINS,
  currentAdmin: null as AdminUser | null,
  committees: INITIAL_COMMITTEES,
  executives: INITIAL_EXECUTIVES,
  members: INITIAL_MEMBERS,
  events: INITIAL_EVENTS,
  articles: INITIAL_ARTICLES,
  gallery: INITIAL_GALLERY,
  faqs: INITIAL_FAQS,
  causes: INITIAL_CAUSES,
  donations: INITIAL_DONATIONS,
  logs: INITIAL_LOGS,
  siteContent: INITIAL_SITE_CONTENT,
  certificates: [] as CertificateData[],
  elibrary: INITIAL_ELIBRARY
};

// Listeners for component reactivity
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyStoreChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Store notification error:', e);
    }
  });
}

// Load cached session & admin from local storage on bootstrap
try {
  const cachedAdmin = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
  if (cachedAdmin) {
    inMemoryStore.currentAdmin = JSON.parse(cachedAdmin);
  }
} catch {
  // ignore
}

// Recursively strip undefined values so Firestore never throws "Unsupported field value: undefined"
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === undefined) {
    return null as unknown as T;
  }
  if (obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

// Automatically compresses large base64 strings and enforces Firestore 1MB limits
export async function sanitizeDocForFirestore<T extends Record<string, any>>(docData: T): Promise<T> {
  const cleaned = cleanFirestoreData(docData) as Record<string, any>;

  // If object has images array (like event.images), compress each and cap to 6 items
  if (Array.isArray(cleaned.images)) {
    const compressedImages: string[] = [];
    for (const img of cleaned.images.slice(0, 6)) {
      if (typeof img === 'string') {
        const c = await compressDataUrl(img, 750, 0.65);
        compressedImages.push(c);
      }
    }
    cleaned.images = compressedImages;
  }

  // Compress individual image fields if they are base64 data URLs
  for (const key of ['flyerUrl', 'photoUrl', 'imageUrl', 'coverImage']) {
    if (typeof cleaned[key] === 'string' && cleaned[key].startsWith('data:image/')) {
      cleaned[key] = await compressDataUrl(cleaned[key], 750, 0.68);
    }
  }

  // Double check payload size
  let jsonStr = JSON.stringify(cleaned);
  if (jsonStr.length > 500000 && Array.isArray(cleaned.images) && cleaned.images.length > 1) {
    cleaned.images = cleaned.images.slice(0, 2);
  }

  return cleaned as T;
}

// Function to seed Firestore if empty on startup
const seededCollections = new Set<string>();

async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
) {
  if (seededCollections.has(collectionName)) return;
  seededCollections.add(collectionName);
  try {
    const batch = writeBatch(db);
    initialData.forEach((item) => {
      const docRef = doc(db, collectionName, item.id);
      batch.set(docRef, cleanFirestoreData(item), { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn(`Firestore seed error for ${collectionName}:`, err);
  }
}

// Setup real-time Firestore listeners for each collection
let isRealtimeInitialized = false;

export function initializeRealtimeFirestore() {
  if (isRealtimeInitialized) return;
  isRealtimeInitialized = true;

  // 1. Members
  onSnapshot(
    collection(db, 'members'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.members = snapshot.docs.map((d) => d.data() as Member);
      } else {
        seedCollectionIfEmpty('members', INITIAL_MEMBERS);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (members):', err)
  );

  // 2. Sessions
  onSnapshot(
    collection(db, 'sessions'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.sessions = snapshot.docs.map((d) => d.data() as AcademicSession);
      } else {
        seedCollectionIfEmpty('sessions', INITIAL_SESSIONS);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (sessions):', err)
  );

  // 3. Executives
  onSnapshot(
    collection(db, 'executives'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.executives = snapshot.docs
          .map((d) => d.data() as Executive)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        seedCollectionIfEmpty('executives', INITIAL_EXECUTIVES);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (executives):', err)
  );

  // 4. Committees
  onSnapshot(
    collection(db, 'committees'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.committees = snapshot.docs.map((d) => d.data() as Committee);
      } else {
        seedCollectionIfEmpty('committees', INITIAL_COMMITTEES);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (committees):', err)
  );

  // 5. Events
  onSnapshot(
    collection(db, 'events'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.events = snapshot.docs.map((d) => d.data() as EventItem);
      } else {
        seedCollectionIfEmpty('events', INITIAL_EVENTS);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (events):', err)
  );

  // 6. Articles
  onSnapshot(
    collection(db, 'articles'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.articles = snapshot.docs.map((d) => d.data() as Article);
      } else {
        seedCollectionIfEmpty('articles', INITIAL_ARTICLES);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (articles):', err)
  );

  // 7. Gallery
  onSnapshot(
    collection(db, 'gallery'),
    (snapshot) => {
      if (!snapshot.empty) {
        seededCollections.add('gallery');
        inMemoryStore.gallery = snapshot.docs.map((d) => d.data() as GalleryItem);
      } else {
        if (!seededCollections.has('gallery')) {
          seedCollectionIfEmpty('gallery', INITIAL_GALLERY);
        } else {
          inMemoryStore.gallery = [];
        }
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (gallery):', err)
  );

  // 8. FAQs
  onSnapshot(
    collection(db, 'faqs'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.faqs = snapshot.docs
          .map((d) => d.data() as FAQItem)
          .sort((a, b) => a.order - b.order);
      } else {
        seedCollectionIfEmpty('faqs', INITIAL_FAQS);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (faqs):', err)
  );

  // 9. Causes
  onSnapshot(
    collection(db, 'causes'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.causes = snapshot.docs.map((d) => d.data() as DonationCause);
      } else {
        seedCollectionIfEmpty('causes', INITIAL_CAUSES);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (causes):', err)
  );

  // 10. Donations
  onSnapshot(
    collection(db, 'donations'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.donations = snapshot.docs.map((d) => d.data() as DonationRecord);
      } else {
        seedCollectionIfEmpty('donations', INITIAL_DONATIONS);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (donations):', err)
  );

  // 11. Site Content
  onSnapshot(
    doc(db, 'site_content', 'main_config'),
    (snapshot) => {
      if (snapshot.exists()) {
        inMemoryStore.siteContent = snapshot.data() as SiteContent;
      } else {
        setDoc(doc(db, 'site_content', 'main_config'), INITIAL_SITE_CONTENT, { merge: true });
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (site_content):', err)
  );

  // 12. Logs
  onSnapshot(
    collection(db, 'logs'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.logs = snapshot.docs
          .map((d) => d.data() as ActivityLog)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else {
        seedCollectionIfEmpty('logs', INITIAL_LOGS);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (logs):', err)
  );

  // 13. Admins
  onSnapshot(
    collection(db, 'admins'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.admins = snapshot.docs.map((d) => d.data() as AdminUser);
      } else {
        seedCollectionIfEmpty('admins', INITIAL_ADMINS);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (admins):', err)
  );

  // 14. Certificates
  onSnapshot(
    collection(db, 'certificates'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.certificates = snapshot.docs.map((d) => d.data() as CertificateData);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (certificates):', err)
  );

  // 15. E-Library & Past Questions
  onSnapshot(
    collection(db, 'elibrary'),
    (snapshot) => {
      if (!snapshot.empty) {
        inMemoryStore.elibrary = snapshot.docs.map((d) => d.data() as ELibraryItem);
      } else {
        seedCollectionIfEmpty('elibrary', INITIAL_ELIBRARY);
      }
      notifyStoreChange();
    },
    (err) => console.warn('Firestore real-time error (elibrary):', err)
  );
}

// Auto-boot listener
initializeRealtimeFirestore();

// Helper security hash generator
function generateSecurityHash(matric: string, session: string): string {
  const cleanMatric = matric.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `FUD-SEC-${randNum}-${suffix}`;
}

export const StorageService = {
  // Reset all
  async resetAllToDefaults(): Promise<void> {
    await seedCollectionIfEmpty('sessions', INITIAL_SESSIONS);
    await seedCollectionIfEmpty('admins', INITIAL_ADMINS);
    await seedCollectionIfEmpty('committees', INITIAL_COMMITTEES);
    await seedCollectionIfEmpty('executives', INITIAL_EXECUTIVES);
    await seedCollectionIfEmpty('members', INITIAL_MEMBERS);
    await seedCollectionIfEmpty('events', INITIAL_EVENTS);
    await seedCollectionIfEmpty('articles', INITIAL_ARTICLES);
    await seedCollectionIfEmpty('gallery', INITIAL_GALLERY);
    await seedCollectionIfEmpty('faqs', INITIAL_FAQS);
    await seedCollectionIfEmpty('causes', INITIAL_CAUSES);
    await seedCollectionIfEmpty('donations', INITIAL_DONATIONS);
    await seedCollectionIfEmpty('elibrary', INITIAL_ELIBRARY);
    await seedCollectionIfEmpty('logs', INITIAL_LOGS);
    await setDoc(doc(db, 'site_content', 'main_config'), cleanFirestoreData(INITIAL_SITE_CONTENT));
    notifyStoreChange();
  },

  // Sessions
  getSessions(): AcademicSession[] {
    return inMemoryStore.sessions;
  },
  getCurrentSession(): AcademicSession {
    const sessions = this.getSessions();
    return sessions.find((s) => s.isCurrent) || sessions[0] || INITIAL_SESSIONS[0];
  },
  async setCurrentSession(id: string): Promise<void> {
    const updated = this.getSessions().map((s) => ({
      ...s,
      isCurrent: s.id === id
    }));
    inMemoryStore.sessions = updated;
    notifyStoreChange();

    // Persist real-time across Firestore
    for (const sess of updated) {
      await setDoc(doc(db, 'sessions', sess.id), cleanFirestoreData(sess), { merge: true });
    }
    const active = updated.find((s) => s.id === id);
    this.addLog('Updated Active Session', `Set session ${active ? active.name : id} as current active for registration.`);
  },
  async addSession(name: string, theme?: string, startDate?: string, endDate?: string): Promise<AcademicSession> {
    const years = name.split('/').map(Number);
    const startYear = years[0] || new Date().getFullYear();
    const endYear = years[1] || startYear + 1;
    const newSession: AcademicSession = {
      id: `session-${startYear}-${endYear}-${Date.now().toString().slice(-4)}`,
      name,
      isCurrent: false,
      theme,
      startYear,
      endYear,
      startDate,
      endDate
    };
    inMemoryStore.sessions.push(newSession);
    notifyStoreChange();

    await setDoc(doc(db, 'sessions', newSession.id), cleanFirestoreData(newSession));
    this.addLog('Created Academic Session', `Added session "${name}" to session registry.`);
    return newSession;
  },
  async updateSession(id: string, updates: Partial<AcademicSession>): Promise<void> {
    const target = inMemoryStore.sessions.find((s) => s.id === id);
    if (!target) return;
    const merged = { ...target, ...updates };
    inMemoryStore.sessions = inMemoryStore.sessions.map((s) => (s.id === id ? merged : s));
    notifyStoreChange();

    await updateDoc(doc(db, 'sessions', id), cleanFirestoreData(updates));
    this.addLog('Updated Academic Session', `Modified session details for "${merged.name}".`);
  },
  async deleteSession(id: string): Promise<void> {
    inMemoryStore.sessions = inMemoryStore.sessions.filter((s) => s.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'sessions', id));
    this.addLog('Deleted Academic Session', `Removed session ID ${id} from registry.`);
  },

  // Registration Status
  async setRegistrationStatus(isOpen: boolean, notice?: string): Promise<void> {
    const currentContent = this.getSiteContent();
    const updated: SiteContent = {
      ...currentContent,
      isRegistrationOpen: isOpen,
      registrationNotice: notice !== undefined ? notice : currentContent.registrationNotice
    };
    inMemoryStore.siteContent = updated;
    notifyStoreChange();

    await setDoc(doc(db, 'site_content', 'main_config'), cleanFirestoreData(updated), { merge: true });
    const currentSess = this.getCurrentSession();
    this.addLog(
      isOpen ? 'Opened Member Registration' : 'Closed Member Registration',
      `Super Admin ${isOpen ? 'opened' : 'closed'} membership registration for ${currentSess.name} session.`
    );
  },
  async toggleRegistration(): Promise<boolean> {
    const current = this.getSiteContent();
    const nextState = !current.isRegistrationOpen;
    await this.setRegistrationStatus(nextState);
    return nextState;
  },

  // Auth / Admin
  getAdmins(): AdminUser[] {
    return inMemoryStore.admins;
  },
  getCurrentAdmin(): AdminUser | null {
    return inMemoryStore.currentAdmin;
  },
  loginAdmin(adminOrEmail: string | AdminUser): AdminUser | null {
    if (typeof adminOrEmail === 'string') {
      const admins = this.getAdmins();
      const found = admins.find((a) => a.email.toLowerCase() === adminOrEmail.trim().toLowerCase());
      if (found) {
        inMemoryStore.currentAdmin = found;
        localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(found));
        notifyStoreChange();
        this.addLog('Admin Login', `${found.fullName || found.name} (${found.portfolio}) logged into portal.`);
        return found;
      }
      const fallbackAdmin: AdminUser = {
        id: `admin-${Date.now()}`,
        name: adminOrEmail.split('@')[0],
        fullName: adminOrEmail.split('@')[0],
        email: adminOrEmail,
        role: 'super_admin',
        portfolio: 'Executive Administrator'
      };
      inMemoryStore.currentAdmin = fallbackAdmin;
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(fallbackAdmin));
      notifyStoreChange();
      this.addLog('Admin Login', `${fallbackAdmin.fullName} logged into portal.`);
      return fallbackAdmin;
    } else {
      inMemoryStore.currentAdmin = adminOrEmail;
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(adminOrEmail));
      notifyStoreChange();
      this.addLog('Admin Login', `${adminOrEmail.fullName || adminOrEmail.name} logged into portal.`);
      return adminOrEmail;
    }
  },
  logoutAdmin(): void {
    const cur = inMemoryStore.currentAdmin;
    if (cur) {
      this.addLog('Admin Logout', `${cur.name} signed out.`);
    }
    inMemoryStore.currentAdmin = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    notifyStoreChange();
  },

  // Members
  getMembers(): Member[] {
    return inMemoryStore.members;
  },
  getMemberById(id: string): Member | undefined {
    return this.getMembers().find((m) => m.id === id);
  },
  getMemberByMatric(matric: string): Member | undefined {
    if (!matric) return undefined;
    const normalized = matric.trim().toLowerCase().replace(/\s+/g, '');
    return this.getMembers().find(
      (m) => m.matricNumber.trim().toLowerCase().replace(/\s+/g, '') === normalized
    );
  },
  getMemberByMembershipId(membershipId: string): Member | undefined {
    if (!membershipId) return undefined;
    const normalized = membershipId.trim().toLowerCase().replace(/\s+/g, '');
    return this.getMembers().find(
      (m) => m.membershipId.trim().toLowerCase().replace(/\s+/g, '') === normalized
    );
  },
  getMemberByEmail(email: string): Member | undefined {
    if (!email) return undefined;
    return this.getMembers().find((m) => m.email.trim().toLowerCase() === email.trim().toLowerCase());
  },

  checkDuplicate(matricNumber: string, email: string): { isDuplicate: boolean; reason?: string; existingMember?: Member } {
    const existingMatric = this.getMemberByMatric(matricNumber);
    if (existingMatric) {
      return {
        isDuplicate: true,
        reason: `A member with Matric Number "${matricNumber}" is already registered (${existingMatric.fullName}).`,
        existingMember: existingMatric
      };
    }
    const existingEmail = this.getMemberByEmail(email);
    if (existingEmail) {
      return {
        isDuplicate: true,
        reason: `A member with Email "${email}" is already registered (${existingEmail.fullName}).`,
        existingMember: existingEmail
      };
    }
    return { isDuplicate: false };
  },

  // Register New Member with instant Real-Time Firestore Sync
  registerMember(data: {
    fullName: string;
    matricNumber: string;
    faculty: string;
    department: string;
    level: string;
    phone: string;
    email: string;
    stateOfOrigin?: string;
    photoUrl: string;
    committeePreference: string;
    secondaryCommittee?: string;
    session?: string;
  }): { member: Member; isExisting: boolean } {
    const duplicateCheck = this.checkDuplicate(data.matricNumber, data.email);
    if (duplicateCheck.isDuplicate && duplicateCheck.existingMember) {
      return { member: duplicateCheck.existingMember, isExisting: true };
    }

    const members = this.getMembers();
    const currentSession = this.getCurrentSession();
    const sessionName = data.session || currentSession.name;
    const yearForId = currentSession.endYear || new Date().getFullYear();

    const sequenceNumber = members.length + 1;
    const paddedNumber = String(sequenceNumber).padStart(3, '0');
    const membershipId = `MSSNFUD/${yearForId}/${paddedNumber}`;
    const securityHash = generateSecurityHash(data.matricNumber, sessionName);

    const newMember: Member = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      membershipId,
      fullName: data.fullName.trim(),
      matricNumber: data.matricNumber.trim().toUpperCase(),
      faculty: data.faculty,
      department: data.department,
      level: data.level,
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      stateOfOrigin: data.stateOfOrigin,
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      committeePreference: data.committeePreference,
      secondaryCommittee: data.secondaryCommittee,
      session: sessionName,
      registrationDate: new Date().toISOString(),
      status: 'active',
      securityHash
    };

    inMemoryStore.members.unshift(newMember);
    notifyStoreChange();

    // Async write to Firestore
    sanitizeDocForFirestore(newMember).then((cleanDoc) => {
      setDoc(doc(db, 'members', newMember.id), cleanDoc).catch((err) =>
        console.error('Real-time member save error:', err)
      );
    });

    this.addLog(
      'Member Registered',
      `${newMember.fullName} (${newMember.matricNumber}) enrolled as ${newMember.membershipId}`
    );

    return { member: newMember, isExisting: false };
  },

  async updateMember(member: Member): Promise<void> {
    inMemoryStore.members = inMemoryStore.members.map((m) => (m.id === member.id ? member : m));
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(member);
    await setDoc(doc(db, 'members', member.id), sanitized, { merge: true });
    this.addLog('Updated Member Record', `Updated profile of ${member.fullName} (${member.membershipId})`);
  },

  async deleteMember(id: string): Promise<void> {
    const target = inMemoryStore.members.find((m) => m.id === id);
    inMemoryStore.members = inMemoryStore.members.filter((m) => m.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'members', id));
    if (target) {
      this.addLog('Deleted Member', `Removed member ${target.fullName} (${target.membershipId})`);
    }
  },

  async bulkImportMembers(importedMembers: Partial<Member>[]): Promise<{ count: number; duplicates: number }> {
    const currentSession = this.getCurrentSession();
    const yearForId = currentSession.endYear || new Date().getFullYear();
    let addedCount = 0;
    let dupCount = 0;
    const batch = writeBatch(db);

    importedMembers.forEach((item, index) => {
      if (!item.fullName || !item.matricNumber || !item.email) return;
      const dup = this.checkDuplicate(item.matricNumber, item.email);
      if (dup.isDuplicate) {
        dupCount++;
        return;
      }
      const seq = inMemoryStore.members.length + 1;
      const paddedNumber = String(seq).padStart(3, '0');
      const membershipId = `MSSNFUD/${yearForId}/${paddedNumber}`;
      const securityHash = generateSecurityHash(item.matricNumber, currentSession.name);

      const newMember: Member = {
        id: `mem-${Date.now()}-${index}`,
        membershipId,
        fullName: item.fullName.trim(),
        matricNumber: item.matricNumber.trim().toUpperCase(),
        faculty: item.faculty || 'Faculty of Science',
        department: item.department || 'Computer Science',
        level: item.level || '100L',
        phone: item.phone || '08000000000',
        email: item.email.trim().toLowerCase(),
        stateOfOrigin: item.stateOfOrigin || 'Jigawa',
        photoUrl: item.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        committeePreference: item.committeePreference || "Da'wah & Tarbiyyah Committee",
        session: currentSession.name,
        registrationDate: new Date().toISOString(),
        status: 'active',
        securityHash
      };
      inMemoryStore.members.unshift(newMember);
      const docRef = doc(db, 'members', newMember.id);
      batch.set(docRef, cleanFirestoreData(newMember));
      addedCount++;
    });

    notifyStoreChange();
    await batch.commit();
    this.addLog('Bulk Member Import', `Successfully imported ${addedCount} members (${dupCount} duplicates skipped).`);
    return { count: addedCount, duplicates: dupCount };
  },

  // Executives
  getExecutives(sessionName?: string): Executive[] {
    const list = inMemoryStore.executives;
    if (!sessionName) return list;
    return list.filter((e) => e.session === sessionName).sort((a, b) => a.order - b.order);
  },
  async addExecutive(exec: Omit<Executive, 'id'>): Promise<Executive> {
    const newExec: Executive = {
      ...exec,
      id: `exec-${Date.now()}`
    };
    inMemoryStore.executives.push(newExec);
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(newExec);
    await setDoc(doc(db, 'executives', newExec.id), sanitized);
    this.addLog('Added Executive Officer', `Added ${newExec.name} as ${newExec.portfolio} for ${newExec.session}`);
    return newExec;
  },
  async updateExecutive(exec: Executive): Promise<void> {
    inMemoryStore.executives = inMemoryStore.executives.map((e) => (e.id === exec.id ? exec : e));
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(exec);
    await setDoc(doc(db, 'executives', exec.id), sanitized, { merge: true });
    this.addLog('Updated Executive Officer', `Updated ${exec.name} (${exec.portfolio})`);
  },
  async deleteExecutive(id: string): Promise<void> {
    const target = inMemoryStore.executives.find((e) => e.id === id);
    inMemoryStore.executives = inMemoryStore.executives.filter((e) => e.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'executives', id));
    if (target) {
      this.addLog('Removed Executive Officer', `Removed ${target.name} from ${target.session} council`);
    }
  },

  // Committees
  getCommittees(): Committee[] {
    return inMemoryStore.committees;
  },
  async updateCommittee(comm: Committee): Promise<void> {
    inMemoryStore.committees = inMemoryStore.committees.map((c) => (c.id === comm.id ? comm : c));
    notifyStoreChange();

    await setDoc(doc(db, 'committees', comm.id), cleanFirestoreData(comm), { merge: true });
    this.addLog('Updated Committee', `Updated details of ${comm.name}`);
  },
  async addCommittee(comm: Omit<Committee, 'id'>): Promise<Committee> {
    const newComm: Committee = {
      ...comm,
      id: `comm-${Date.now()}`
    };
    inMemoryStore.committees.push(newComm);
    notifyStoreChange();

    await setDoc(doc(db, 'committees', newComm.id), cleanFirestoreData(newComm));
    this.addLog('Created Committee', `Added ${newComm.name} to MSSNFUD structure.`);
    return newComm;
  },

  // Events
  getEvents(sessionName?: string): EventItem[] {
    const list = inMemoryStore.events;
    if (!sessionName) return list;
    return list.filter((e) => e.session === sessionName);
  },
  async addEvent(event: Omit<EventItem, 'id'>): Promise<EventItem> {
    const newEvent: EventItem = {
      ...event,
      id: `event-${Date.now()}`
    };
    inMemoryStore.events.unshift(newEvent);
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(newEvent);
    await setDoc(doc(db, 'events', newEvent.id), sanitized);
    this.addLog('Created Event', `Published event "${newEvent.title}" for ${newEvent.date}`);
    return newEvent;
  },
  async updateEvent(event: EventItem): Promise<void> {
    inMemoryStore.events = inMemoryStore.events.map((e) => (e.id === event.id ? event : e));
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(event);
    await setDoc(doc(db, 'events', event.id), sanitized, { merge: true });
    this.addLog('Updated Event', `Modified event "${event.title}"`);
  },
  async deleteEvent(id: string): Promise<void> {
    const target = inMemoryStore.events.find((e) => e.id === id);
    inMemoryStore.events = inMemoryStore.events.filter((e) => e.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'events', id));
    if (target) {
      this.addLog('Deleted Event', `Removed event "${target.title}"`);
    }
  },

  // Articles / Blog
  getArticles(): Article[] {
    return inMemoryStore.articles;
  },
  async addArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const newArt: Article = {
      ...article,
      id: `art-${Date.now()}`
    };
    inMemoryStore.articles.unshift(newArt);
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(newArt);
    await setDoc(doc(db, 'articles', newArt.id), sanitized);
    this.addLog('Published Article', `Published "${newArt.title}" by ${newArt.author}`);
    return newArt;
  },
  async updateArticle(article: Article): Promise<void> {
    inMemoryStore.articles = inMemoryStore.articles.map((a) => (a.id === article.id ? article : a));
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(article);
    await setDoc(doc(db, 'articles', article.id), sanitized, { merge: true });
    this.addLog('Updated Article', `Modified article "${article.title}"`);
  },
  async deleteArticle(id: string): Promise<void> {
    const target = inMemoryStore.articles.find((a) => a.id === id);
    inMemoryStore.articles = inMemoryStore.articles.filter((a) => a.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'articles', id));
    if (target) {
      this.addLog('Deleted Article', `Removed article "${target.title}"`);
    }
  },

  // Gallery
  getGallery(sessionName?: string): GalleryItem[] {
    const list = inMemoryStore.gallery;
    if (!sessionName) return list;
    return list.filter((g) => g.session === sessionName);
  },
  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    inMemoryStore.gallery.unshift(newItem);
    notifyStoreChange();

    const sanitized = await sanitizeDocForFirestore(newItem);
    await setDoc(doc(db, 'gallery', newItem.id), sanitized);
    this.addLog('Added Photo to Gallery', `Uploaded "${newItem.title}"`);
    return newItem;
  },
  async addMultipleGalleryItems(items: Omit<GalleryItem, 'id'>[]): Promise<GalleryItem[]> {
    if (!items || items.length === 0) return [];
    const timestamp = Date.now();
    const newItems: GalleryItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const newItem: GalleryItem = {
        ...item,
        id: `gal-${timestamp}-${i}-${randomSuffix}`
      };
      newItems.push(newItem);
    }

    inMemoryStore.gallery = [...newItems, ...inMemoryStore.gallery];
    notifyStoreChange();

    // Persist to Firestore
    try {
      const batch = writeBatch(db);
      for (const item of newItems) {
        const sanitized = await sanitizeDocForFirestore(item);
        batch.set(doc(db, 'gallery', item.id), sanitized);
      }
      await batch.commit();
    } catch (err) {
      console.error('Batch gallery save error, writing individually:', err);
      for (const item of newItems) {
        try {
          const sanitized = await sanitizeDocForFirestore(item);
          await setDoc(doc(db, 'gallery', item.id), sanitized);
        } catch (e) {
          console.error(`Failed to save gallery item ${item.id}:`, e);
        }
      }
    }

    this.addLog('Batch Uploaded Photos', `Added ${newItems.length} photos to Media Gallery.`);
    return newItems;
  },
  async deleteGalleryItem(id: string): Promise<void> {
    const target = inMemoryStore.gallery.find((g) => g.id === id);
    inMemoryStore.gallery = inMemoryStore.gallery.filter((g) => g.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'gallery', id));
    if (target) {
      this.addLog('Deleted Gallery Photo', `Removed photo "${target.title}"`);
    }
  },
  async deleteMultipleGalleryItems(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    inMemoryStore.gallery = inMemoryStore.gallery.filter((g) => !idSet.has(g.id));
    notifyStoreChange();

    try {
      const batch = writeBatch(db);
      ids.forEach((id) => {
        batch.delete(doc(db, 'gallery', id));
      });
      await batch.commit();
    } catch (err) {
      console.error('Batch gallery delete error:', err);
      for (const id of ids) {
        await deleteDoc(doc(db, 'gallery', id)).catch(() => {});
      }
    }
    this.addLog('Bulk Deleted Photos', `Deleted ${ids.length} photos from Media Gallery.`);
  },

  // FAQs
  getFAQs(): FAQItem[] {
    return inMemoryStore.faqs;
  },
  async addFAQ(faq: Omit<FAQItem, 'id'>): Promise<FAQItem> {
    const newFAQ: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`
    };
    inMemoryStore.faqs.push(newFAQ);
    notifyStoreChange();

    await setDoc(doc(db, 'faqs', newFAQ.id), cleanFirestoreData(newFAQ));
    this.addLog('Added FAQ', `Created question "${newFAQ.question.substring(0, 40)}..."`);
    return newFAQ;
  },
  async updateFAQ(faq: FAQItem): Promise<void> {
    inMemoryStore.faqs = inMemoryStore.faqs.map((f) => (f.id === faq.id ? faq : f));
    notifyStoreChange();

    await setDoc(doc(db, 'faqs', faq.id), cleanFirestoreData(faq), { merge: true });
    this.addLog('Updated FAQ', `Modified question "${faq.question.substring(0, 40)}..."`);
  },
  async deleteFAQ(id: string): Promise<void> {
    const target = inMemoryStore.faqs.find((f) => f.id === id);
    inMemoryStore.faqs = inMemoryStore.faqs.filter((f) => f.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'faqs', id));
    this.addLog('Deleted FAQ', `Removed FAQ item ${target ? `"${target.question.substring(0, 30)}..."` : id}`);
  },
  async updateFAQs(faqs: FAQItem[]): Promise<void> {
    inMemoryStore.faqs = faqs;
    notifyStoreChange();

    const batch = writeBatch(db);
    faqs.forEach((f) => {
      batch.set(doc(db, 'faqs', f.id), cleanFirestoreData(f), { merge: true });
    });
    await batch.commit();
    this.addLog('Updated FAQs', `Updated FAQ entries (${faqs.length} total)`);
  },

  // E-Library & Academic Resources
  getELibrary(): ELibraryItem[] {
    return inMemoryStore.elibrary;
  },
  async addELibraryItem(item: Omit<ELibraryItem, 'id' | 'downloadCount' | 'uploadDate'>): Promise<ELibraryItem> {
    const newItem: ELibraryItem = {
      ...item,
      id: `elib-${Date.now()}`,
      downloadCount: 0,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    inMemoryStore.elibrary.unshift(newItem);
    notifyStoreChange();

    await setDoc(doc(db, 'elibrary', newItem.id), cleanFirestoreData(newItem));
    this.addLog('Added E-Library Resource', `Uploaded document "${newItem.title}" (${newItem.category})`);
    return newItem;
  },
  async updateELibraryItem(item: ELibraryItem): Promise<void> {
    inMemoryStore.elibrary = inMemoryStore.elibrary.map((e) => (e.id === item.id ? item : e));
    notifyStoreChange();

    await setDoc(doc(db, 'elibrary', item.id), cleanFirestoreData(item), { merge: true });
    this.addLog('Updated E-Library Resource', `Updated document "${item.title}"`);
  },
  async deleteELibraryItem(id: string): Promise<void> {
    const target = inMemoryStore.elibrary.find((e) => e.id === id);
    inMemoryStore.elibrary = inMemoryStore.elibrary.filter((e) => e.id !== id);
    notifyStoreChange();

    await deleteDoc(doc(db, 'elibrary', id));
    if (target) {
      this.addLog('Deleted E-Library Resource', `Removed document "${target.title}"`);
    }
  },
  async deleteMultipleELibraryItems(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    inMemoryStore.elibrary = inMemoryStore.elibrary.filter((e) => !idSet.has(e.id));
    notifyStoreChange();

    try {
      const batch = writeBatch(db);
      ids.forEach((id) => {
        batch.delete(doc(db, 'elibrary', id));
      });
      await batch.commit();
    } catch (err) {
      console.error('Batch elibrary delete error:', err);
      for (const id of ids) {
        await deleteDoc(doc(db, 'elibrary', id)).catch(() => {});
      }
    }
    this.addLog('Bulk Deleted E-Library Documents', `Deleted ${ids.length} resources from repository.`);
  },
  async incrementELibraryDownload(id: string): Promise<void> {
    const target = inMemoryStore.elibrary.find((e) => e.id === id);
    if (!target) return;
    const updatedCount = (target.downloadCount || 0) + 1;
    inMemoryStore.elibrary = inMemoryStore.elibrary.map((e) => (e.id === id ? { ...e, downloadCount: updatedCount } : e));
    notifyStoreChange();

    updateDoc(doc(db, 'elibrary', id), { downloadCount: updatedCount }).catch((e) => console.warn('Download increment note:', e));
  },

  // Causes & Donations
  getCauses(): DonationCause[] {
    return inMemoryStore.causes;
  },
  async updateCause(cause: DonationCause): Promise<void> {
    inMemoryStore.causes = inMemoryStore.causes.map((c) => (c.id === cause.id ? cause : c));
    notifyStoreChange();

    await setDoc(doc(db, 'causes', cause.id), cleanFirestoreData(cause), { merge: true });
    this.addLog('Updated Donation Cause', `Updated campaign "${cause.title}"`);
  },
  getDonations(): DonationRecord[] {
    return inMemoryStore.donations;
  },
  async addDonationRecord(record: Omit<DonationRecord, 'id' | 'status' | 'date'>): Promise<DonationRecord> {
    const newDonation: DonationRecord = {
      ...record,
      id: `don-${Date.now()}`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    inMemoryStore.donations.unshift(newDonation);
    notifyStoreChange();

    await setDoc(doc(db, 'donations', newDonation.id), cleanFirestoreData(newDonation));
    this.addLog('Logged Donation Transfer', `Submitted ₦${record.amount.toLocaleString()} for "${record.causeTitle}"`);
    return newDonation;
  },
  async verifyDonation(id: string, status: 'verified' | 'rejected'): Promise<void> {
    const target = inMemoryStore.donations.find((d) => d.id === id);
    if (!target) return;

    inMemoryStore.donations = inMemoryStore.donations.map((d) => (d.id === id ? { ...d, status } : d));

    if (status === 'verified') {
      inMemoryStore.causes = inMemoryStore.causes.map((c) => {
        if (c.id === target.causeId) {
          const updated = { ...c, raisedAmount: (c.raisedAmount || 0) + target.amount };
          setDoc(doc(db, 'causes', c.id), cleanFirestoreData(updated), { merge: true });
          return updated;
        }
        return c;
      });
    }

    notifyStoreChange();
    await updateDoc(doc(db, 'donations', id), cleanFirestoreData({ status }));
    this.addLog('Reconciled Donation', `Marked payment ${id} as ${status}`);
  },

  // Site Content
  getSiteContent(): SiteContent {
    return inMemoryStore.siteContent;
  },
  async updateSiteContent(content: SiteContent): Promise<void> {
    inMemoryStore.siteContent = content;
    notifyStoreChange();

    await setDoc(doc(db, 'site_content', 'main_config'), cleanFirestoreData(content), { merge: true });
    this.addLog('Updated Website Content', 'Modified general parameters and social links in real time.');
  },

  // Activity Logs
  getLogs(): ActivityLog[] {
    return inMemoryStore.logs;
  },
  async addLog(action: string, target: string, details?: string): Promise<void> {
    const curAdmin = this.getCurrentAdmin();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      adminName: curAdmin ? curAdmin.name : 'System/Student Portal',
      adminRole: curAdmin ? curAdmin.role : 'super_admin',
      action,
      target,
      timestamp: new Date().toISOString(),
      ...(details !== undefined && details !== null ? { details } : {})
    };
    inMemoryStore.logs.unshift(newLog);
    if (inMemoryStore.logs.length > 150) inMemoryStore.logs.length = 150;
    notifyStoreChange();

    setDoc(doc(db, 'logs', newLog.id), cleanFirestoreData(newLog)).catch((e) => console.warn('Log save note:', e));
  },

  // Certificates
  getCertificates(): CertificateData[] {
    return inMemoryStore.certificates;
  },
  async createCertificate(cert: Omit<CertificateData, 'id' | 'verificationCode'>): Promise<CertificateData> {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const verificationCode = `CERT-MSSNFUD-${cert.session.replace('/', '-')}-${rand}`;
    const newCert: CertificateData = {
      ...cert,
      id: `cert-${Date.now()}`,
      verificationCode
    };
    inMemoryStore.certificates.unshift(newCert);
    notifyStoreChange();

    await setDoc(doc(db, 'certificates', newCert.id), cleanFirestoreData(newCert));
    this.addLog(
      'Generated Certificate',
      `Issued ${newCert.type} certificate to ${newCert.recipientName} (${newCert.verificationCode})`
    );
    return newCert;
  }
};
