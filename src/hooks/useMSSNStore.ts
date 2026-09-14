import { useState, useEffect, useCallback } from 'react';
import { StorageService, subscribeToStore } from '../services/storage';
import { FUD_FACULTIES } from '../data/mockDatabase';
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

export function useMSSNStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const currentSession = StorageService.getCurrentSession();
  const sessions = StorageService.getSessions();
  const currentAdmin = StorageService.getCurrentAdmin();
  const admins = StorageService.getAdmins();
  const members = StorageService.getMembers();
  const executives = StorageService.getExecutives();
  const committees = StorageService.getCommittees();
  const events = StorageService.getEvents();
  const articles = StorageService.getArticles();
  const gallery = StorageService.getGallery();
  const faqs = StorageService.getFAQs();
  const causes = StorageService.getCauses();
  const donations = StorageService.getDonations();
  const siteContent = StorageService.getSiteContent();
  const logs = StorageService.getLogs();
  const certificates = StorageService.getCertificates();
  const elibrary = StorageService.getELibrary();

  // Helper to export CSV
  const exportMembersCSV = useCallback(() => {
    const allMembers = StorageService.getMembers();
    const headers = [
      'Membership ID',
      'Full Name',
      'Matric Number',
      'Faculty',
      'Department',
      'Level',
      'Phone Number',
      'Email',
      'State of Origin',
      'Committee Preference',
      'Session',
      'Registration Date',
      'Status'
    ];

    const rows = allMembers.map((m) => [
      `"${m.membershipId}"`,
      `"${m.fullName}"`,
      `"${m.matricNumber}"`,
      `"${m.faculty}"`,
      `"${m.department}"`,
      `"${m.level}"`,
      `"${m.phone || ''}"`,
      `"${m.email}"`,
      `"${m.stateOfOrigin || ''}"`,
      `"${m.committeePreference}"`,
      `"${m.session}"`,
      `"${m.registrationDate}"`,
      `"${m.status}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `MSSNFUD_Members_Export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    currentSession,
    sessions,
    currentAdmin,
    adminUser: currentAdmin,
    admins,
    members,
    executives,
    committees,
    events,
    articles,
    gallery,
    faqs,
    causes,
    donations,
    siteContent,
    logs,
    certificates,
    elibrary,
    faculties: FUD_FACULTIES,
    fudFaculties: FUD_FACULTIES,

    // Methods
    setCurrentSession: useCallback(
      (id: string) => StorageService.setCurrentSession(id),
      []
    ),
    addSession: useCallback(
      (data: { name: string; theme?: string; startDate?: string; endDate?: string; isCurrent?: boolean }) =>
        StorageService.addSession(data.name, data.theme, data.startDate, data.endDate),
      []
    ),
    updateSession: useCallback(
      (id: string, updates: Partial<AcademicSession>) =>
        StorageService.updateSession(id, updates),
      []
    ),
    deleteSession: useCallback(
      (id: string) => StorageService.deleteSession(id),
      []
    ),
    setRegistrationStatus: useCallback(
      (isOpen: boolean, notice?: string) =>
        StorageService.setRegistrationStatus(isOpen, notice),
      []
    ),
    toggleRegistration: useCallback(
      () => StorageService.toggleRegistration(),
      []
    ),
    loginAdmin: useCallback((adminOrEmail: string | AdminUser) => StorageService.loginAdmin(adminOrEmail), []),
    logoutAdmin: useCallback(() => StorageService.logoutAdmin(), []),
    registerMember: useCallback(
      (data: Parameters<typeof StorageService.registerMember>[0]) =>
        StorageService.registerMember(data),
      []
    ),
    checkDuplicate: useCallback(
      (matric: string, email: string) => StorageService.checkDuplicate(matric, email),
      []
    ),
    updateMember: useCallback(
      (idOrMember: string | Member, updates?: Partial<Member>) => {
        if (typeof idOrMember === 'string') {
          const list = StorageService.getMembers();
          const target = list.find((m) => m.id === idOrMember);
          if (target) {
            StorageService.updateMember({ ...target, ...updates, id: idOrMember } as Member);
          }
        } else {
          StorageService.updateMember(idOrMember);
        }
      },
      []
    ),
    deleteMember: useCallback((id: string) => StorageService.deleteMember(id), []),
    bulkImportMembers: useCallback(
      (list: Partial<Member>[]) => StorageService.bulkImportMembers(list),
      []
    ),
    getMemberByMatric: useCallback(
      (matric: string) => StorageService.getMemberByMatric(matric),
      []
    ),
    getMemberByMembershipId: useCallback(
      (id: string) => StorageService.getMemberByMembershipId(id),
      []
    ),
    addExecutive: useCallback(
      (exec: Parameters<typeof StorageService.addExecutive>[0]) =>
        StorageService.addExecutive(exec),
      []
    ),
    updateExecutive: useCallback(
      (idOrExec: string | Executive, updates?: Partial<Executive>) => {
        if (typeof idOrExec === 'string') {
          const list = StorageService.getExecutives();
          const target = list.find((e) => e.id === idOrExec);
          if (target) {
            StorageService.updateExecutive({ ...target, ...updates, id: idOrExec } as Executive);
          }
        } else {
          StorageService.updateExecutive(idOrExec);
        }
      },
      []
    ),
    deleteExecutive: useCallback((id: string) => StorageService.deleteExecutive(id), []),
    addCommittee: useCallback(
      (comm: Parameters<typeof StorageService.addCommittee>[0]) =>
        StorageService.addCommittee(comm),
      []
    ),
    updateCommittee: useCallback(
      (idOrComm: string | Committee, updates?: Partial<Committee>) => {
        if (typeof idOrComm === 'string') {
          const list = StorageService.getCommittees();
          const target = list.find((c) => c.id === idOrComm);
          if (target) {
            StorageService.updateCommittee({ ...target, ...updates, id: idOrComm } as Committee);
          }
        } else {
          StorageService.updateCommittee(idOrComm);
        }
      },
      []
    ),
    addEvent: useCallback(
      (event: Parameters<typeof StorageService.addEvent>[0]) =>
        StorageService.addEvent(event),
      []
    ),
    updateEvent: useCallback(
      (idOrEvent: string | EventItem, updates?: Partial<EventItem>) => {
        if (typeof idOrEvent === 'string') {
          const list = StorageService.getEvents();
          const target = list.find((e) => e.id === idOrEvent);
          if (target) {
            StorageService.updateEvent({ ...target, ...updates, id: idOrEvent } as EventItem);
          }
        } else {
          StorageService.updateEvent(idOrEvent);
        }
      },
      []
    ),
    deleteEvent: useCallback((id: string) => StorageService.deleteEvent(id), []),
    addArticle: useCallback(
      (art: Parameters<typeof StorageService.addArticle>[0]) =>
        StorageService.addArticle(art),
      []
    ),
    updateArticle: useCallback(
      (idOrArt: string | Article, updates?: Partial<Article>) => {
        if (typeof idOrArt === 'string') {
          const list = StorageService.getArticles();
          const target = list.find((a) => a.id === idOrArt);
          if (target) {
            StorageService.updateArticle({ ...target, ...updates, id: idOrArt } as Article);
          }
        } else {
          StorageService.updateArticle(idOrArt);
        }
      },
      []
    ),
    deleteArticle: useCallback((id: string) => StorageService.deleteArticle(id), []),
    addGalleryItem: useCallback(
      (item: Parameters<typeof StorageService.addGalleryItem>[0]) =>
        StorageService.addGalleryItem(item),
      []
    ),
    addMultipleGalleryItems: useCallback(
      (items: Parameters<typeof StorageService.addMultipleGalleryItems>[0]) =>
        StorageService.addMultipleGalleryItems(items),
      []
    ),
    deleteGalleryItem: useCallback(
      (id: string) => StorageService.deleteGalleryItem(id),
      []
    ),
    deleteMultipleGalleryItems: useCallback(
      (ids: string[]) => StorageService.deleteMultipleGalleryItems(ids),
      []
    ),
    addFAQ: useCallback((faq: Parameters<typeof StorageService.addFAQ>[0]) => StorageService.addFAQ(faq), []),
    updateFAQ: useCallback((faq: FAQItem) => StorageService.updateFAQ(faq), []),
    deleteFAQ: useCallback((id: string) => StorageService.deleteFAQ(id), []),
    updateFAQs: useCallback((items: FAQItem[]) => StorageService.updateFAQs(items), []),
    addELibraryItem: useCallback(
      (item: Parameters<typeof StorageService.addELibraryItem>[0]) => StorageService.addELibraryItem(item),
      []
    ),
    updateELibraryItem: useCallback((item: ELibraryItem) => StorageService.updateELibraryItem(item), []),
    deleteELibraryItem: useCallback((id: string) => StorageService.deleteELibraryItem(id), []),
    deleteMultipleELibraryItems: useCallback((ids: string[]) => StorageService.deleteMultipleELibraryItems(ids), []),
    incrementELibraryDownload: useCallback((id: string) => StorageService.incrementELibraryDownload(id), []),
    updateCause: useCallback((cause: DonationCause) => StorageService.updateCause(cause), []),
    updateDonationCause: useCallback(
      (id: string, cause: Partial<DonationCause>) => {
        const existing = StorageService.getCauses().find((c) => c.id === id);
        if (existing) {
          StorageService.updateCause({ ...existing, ...cause });
        }
      },
      []
    ),
    addDonation: useCallback(
      (record: {
        donorName: string;
        donorEmail?: string;
        donorPhone?: string;
        amount: number;
        causeId: string;
        causeTitle: string;
        paymentMethod: string;
        referenceNumber: string;
        notes?: string;
      }) => StorageService.addDonationRecord(record),
      []
    ),
    addDonationRecord: useCallback(
      (record: Parameters<typeof StorageService.addDonationRecord>[0]) =>
        StorageService.addDonationRecord(record),
      []
    ),
    verifyDonation: useCallback(
      (id: string, status: 'verified' | 'rejected') =>
        StorageService.verifyDonation(id, status),
      []
    ),
    updateSiteContent: useCallback(
      (content: SiteContent) => StorageService.updateSiteContent(content),
      []
    ),
    createCertificate: useCallback(
      (cert: Parameters<typeof StorageService.createCertificate>[0]) =>
        StorageService.createCertificate(cert),
      []
    ),
    resetAllToDefaults: useCallback(() => StorageService.resetAllToDefaults(), []),
    resetToDefaults: useCallback(() => StorageService.resetAllToDefaults(), []),
    exportMembersCSV
  };
}
