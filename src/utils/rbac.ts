import { AdminRole } from '../types';
import { AdminSection } from '../components/admin/AdminDashboard';

export interface RoleDetail {
  role: AdminRole;
  title: string;
  shortName: string;
  portfolio: string;
  description: string;
  allowedSections: AdminSection[];
  badgeBg: string;
  badgeText: string;
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleDetail> = {
  super_admin: {
    role: 'super_admin',
    title: 'Super Administrator',
    shortName: 'Super Admin',
    portfolio: 'Full System Administration & Security',
    description: 'Complete unrestricted authority across all operational, financial, academic, CMS, and system settings.',
    allowedSections: [
      'overview',
      'site_content',
      'elibrary',
      'faqs',
      'members',
      'sessions',
      'executives',
      'committees',
      'events',
      'gallery',
      'blog',
      'donations',
      'settings'
    ],
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-900'
  },
  amir: {
    role: 'amir',
    title: 'Amir (President)',
    shortName: 'Amir',
    portfolio: 'Executive Governance & Overall Leadership',
    description: 'Directs the executive council, oversees committee activities, coordinates major programs, reviews welfare, and manages site content.',
    allowedSections: [
      'overview',
      'site_content',
      'elibrary',
      'faqs',
      'executives',
      'committees',
      'events',
      'members',
      'blog',
      'donations'
    ],
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900'
  },
  secretary: {
    role: 'secretary',
    title: 'General Secretary',
    shortName: 'Gen. Secretary',
    portfolio: 'Secretariat, Membership Records & Archives',
    description: 'Maintains official registers, membership e-ID verification, council rosters, constitution docs, and academic session records.',
    allowedSections: [
      'overview',
      'site_content',
      'elibrary',
      'faqs',
      'members',
      'executives',
      'committees',
      'sessions',
      'events'
    ],
    badgeBg: 'bg-blue-100 border-blue-300',
    badgeText: 'text-blue-900'
  },
  financial_sec: {
    role: 'financial_sec',
    title: 'Financial Secretary / Treasurer',
    shortName: 'Financial Sec.',
    portfolio: 'Treasury, Sadaqah & Student Welfare Funds',
    description: 'Manages donation appeals, verifies donor transactions, audits student welfare disbursements, and tracks dues.',
    allowedSections: [
      'overview',
      'donations',
      'members'
    ],
    badgeBg: 'bg-rose-100 border-rose-300',
    badgeText: 'text-rose-900'
  },
  dos: {
    role: 'dos',
    title: 'Director of Studies (DOS)',
    shortName: 'Dir. of Studies',
    portfolio: 'Academics, Da\'wah & Student Mentorship',
    description: 'Coordinates Jihad Week academic lectures, E-Library past questions, tutorial classes, educational publications, and FAQs.',
    allowedSections: [
      'overview',
      'elibrary',
      'faqs',
      'events',
      'blog',
      'committees',
      'members'
    ],
    badgeBg: 'bg-teal-100 border-teal-300',
    badgeText: 'text-teal-900'
  },
  media: {
    role: 'media',
    title: 'Publicity & Media Officer (PRO)',
    shortName: 'Media / PRO',
    portfolio: 'Media Coverage, Public Relations & Press',
    description: 'Produces press releases, manages live site banners, updates event media, and curates the photo gallery.',
    allowedSections: [
      'overview',
      'site_content',
      'gallery',
      'blog',
      'events'
    ],
    badgeBg: 'bg-indigo-100 border-indigo-300',
    badgeText: 'text-indigo-900'
  },
  pro_editor: {
    role: 'pro_editor',
    title: 'Editorial & Content Officer',
    shortName: 'Editor',
    portfolio: 'Publications & Written Content',
    description: 'Reviews, curates, drafts, and publishes live hero slides, articles, E-Library notes, FAQs, and announcements.',
    allowedSections: [
      'overview',
      'site_content',
      'elibrary',
      'faqs',
      'blog',
      'gallery',
      'events'
    ],
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-900'
  },
  executive: {
    role: 'executive',
    title: 'Executive Council Officer',
    shortName: 'Executive',
    portfolio: 'Branch Operations & Committee Activities',
    description: 'Coordinates assigned committee operations, program activities, and student engagement.',
    allowedSections: [
      'overview',
      'elibrary',
      'events',
      'committees',
      'gallery',
      'blog'
    ],
    badgeBg: 'bg-slate-100 border-slate-300',
    badgeText: 'text-slate-800'
  }
};

export const isSectionAllowed = (role: AdminRole | undefined, section: AdminSection): boolean => {
  if (!role) return false;
  const config = ROLE_DEFINITIONS[role];
  if (!config) return role === 'super_admin';
  return config.allowedSections.includes(section);
};

export const getAllowedSections = (role: AdminRole | undefined): AdminSection[] => {
  if (!role) return ['overview'];
  const config = ROLE_DEFINITIONS[role];
  return config ? config.allowedSections : ['overview'];
};

export const getRoleDetail = (role: AdminRole | undefined): RoleDetail => {
  if (!role || !ROLE_DEFINITIONS[role]) {
    return ROLE_DEFINITIONS['super_admin'];
  }
  return ROLE_DEFINITIONS[role];
};
