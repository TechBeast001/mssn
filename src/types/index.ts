export type AdminRole =
  | 'super_admin'
  | 'executive'
  | 'pro_editor'
  | 'amir'
  | 'secretary'
  | 'financial_sec'
  | 'dos'
  | 'media';

export interface AdminUser {
  id: string;
  name: string;
  fullName?: string;
  username?: string;
  email: string;
  role: AdminRole;
  portfolio: string;
  session?: string;
  avatarUrl?: string;
}

export type MemberStatus = 'active' | 'inactive' | 'alumni' | 'suspended';

export interface Member {
  id: string;
  membershipId: string; // MSSNFUD/2025/001
  fullName: string;
  matricNumber: string; // e.g. FUD/22/SCI/042
  faculty: string;
  department: string;
  level: string; // 100L, 200L, 300L, 400L, 500L, Postgraduate
  phone: string;
  phoneNumber?: string; // alias
  email: string;
  stateOfOrigin?: string;
  photoUrl: string;
  committeePreference: string;
  secondaryCommittee?: string;
  session: string; // e.g. 2024/2025
  registrationDate: string;
  status: MemberStatus;
  notes?: string;
  securityHash?: string;
}

export interface AcademicSession {
  id: string;
  name: string; // "2024/2025"
  isCurrent: boolean;
  theme?: string;
  startYear: number;
  endYear: number;
  startDate?: string;
  endDate?: string;
}

export interface Executive {
  id: string;
  name: string;
  portfolio: string; // Amir (President), Amirah (Sisters' Coordinator), Naibul Amir (Admin), etc.
  arabicTitle?: string;
  session: string; // "2024/2025"
  department: string;
  faculty?: string;
  matricNumber?: string;
  level: string;
  photoUrl: string;
  phone?: string;
  email?: string;
  bio?: string;
  order: number;
}

export type ExecutiveMember = Executive;

export interface Committee {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  meetingSchedule: string;
  headName: string;
  headMatric?: string;
  headPhoto?: string;
  secretaryName?: string;
  activeSession: string;
}

export type EventCategory =
  | 'dawah'
  | 'academic'
  | 'sisters'
  | 'social'
  | 'orientation'
  | 'ramadan'
  | 'ivc';

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  session: string;
  date: string;
  time: string;
  venue: string;
  flyerUrl: string;
  images?: string[];
  summary: string;
  fullDetails: string;
  speakers?: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  featured?: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug?: string;
  author: string;
  authorRole?: string;
  category: string;
  readTime: string;
  publishedAt: string;
  session?: string;
  coverImage: string;
  summary: string;
  content: string;
  tags: string[];
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  session: string;
  imageUrl: string;
  date: string;
  caption?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface DonationCause {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  category?: 'welfare' | 'dawah' | 'infrastructure' | 'jihad_week';
  urgency?: 'normal' | 'high' | 'urgent';
}

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  causeId: string;
  causeTitle: string;
  paymentMethod: string;
  referenceNumber: string;
  reference?: string;
  receiptUrl?: string;
  status: 'verified' | 'pending' | 'rejected';
  date: string;
  createdAt?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

export type CertificateType = 'service' | 'participation' | 'merit' | 'tenure';

export interface CertificateData {
  id: string;
  recipientName: string;
  matricNumber?: string;
  membershipId?: string;
  type: CertificateType;
  title: string;
  eventOrRole: string;
  session: string;
  issueDate: string;
  citation: string;
  signatureAmirName: string;
  signatureAdviserName: string;
  verificationCode: string;
}

export interface HeroSlide {
  id: number | string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  primaryActionLabel: string;
  primaryActionTarget: string; // 'register' | 'about' | 'committees' | 'events' | 'blog' | 'donations' | 'verify' | 'elibrary'
  secondaryActionLabel: string;
  secondaryActionTarget: string;
  order?: number;
  isActive?: boolean;
}

export type ELibraryCategory =
  | 'past_questions'
  | 'lecture_notes'
  | 'handouts'
  | 'constitution'
  | 'academic_guide'
  | 'islamic_book'
  | 'magazine';

export interface ELibraryItem {
  id: string;
  title: string;
  courseCode?: string; // e.g. "GST 111", "CSC 201", "MTH 101"
  category: ELibraryCategory;
  faculty: string;
  department: string;
  level: string; // "100L", "200L", "300L", "400L", "500L", "General", "Postgraduate"
  session: string; // e.g. "2026/2027"
  semester?: 'First Semester' | 'Second Semester' | 'Both Semesters';
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'zip' | 'link';
  fileSize?: string; // e.g. "2.4 MB"
  downloadCount: number;
  description: string;
  authorOrLecturer?: string;
  uploadedBy: string;
  uploadDate: string;
  featured?: boolean;
}

export interface SiteContent {
  heroSlides?: HeroSlide[];
  heroHeadline?: string;
  heroSubtitle?: string;
  aboutHistory: string;
  vision: string;
  mission: string;
  coreValues: { title: string; desc: string }[];
  announcementTicker: string;
  isAnnouncementActive: boolean;
  isRegistrationOpen: boolean;
  registrationNotice?: string;
  contactEmail: string;
  contactPhone: string;
  secretariatAddress: string;
  prayerTimes?: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    locationNotice?: string;
  };
  hadithOfTheDay?: {
    arabic: string;
    translation: string;
    narratorOrSource: string;
    theme?: string;
  };
  tiktokUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  whatsappUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  telegramUrl?: string;
}
