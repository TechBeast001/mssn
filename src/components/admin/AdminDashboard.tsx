import React, { useState, useEffect } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { HeaderBrand } from '../common/HeaderBrand';
import { AdminOverview } from './AdminOverview';
import { AdminMembers } from './AdminMembers';
import { AdminSessions } from './AdminSessions';
import { AdminExecutives } from './AdminExecutives';
import { AdminCommittees } from './AdminCommittees';
import { AdminEvents } from './AdminEvents';
import { AdminGallery } from './AdminGallery';
import { AdminBlog } from './AdminBlog';
import { AdminDonations } from './AdminDonations';
import { AdminSettings } from './AdminSettings';
import { AdminSiteContent } from './AdminSiteContent';
import { AdminELibrary } from './AdminELibrary';
import { AdminFAQs } from './AdminFAQs';
import { RegistrationModal } from '../registration/RegistrationModal';
import {
  ROLE_DEFINITIONS,
  isSectionAllowed,
  getAllowedSections,
  getRoleDetail
} from '../../utils/rbac';
import { AdminRole } from '../../types';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  BookOpen,
  CalendarDays,
  Image,
  FileText,
  HeartHandshake,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  RefreshCw,
  Info
} from 'lucide-react';

export type AdminSection =
  | 'overview'
  | 'site_content'
  | 'elibrary'
  | 'faqs'
  | 'members'
  | 'sessions'
  | 'executives'
  | 'committees'
  | 'events'
  | 'gallery'
  | 'blog'
  | 'donations'
  | 'settings';

interface AdminDashboardProps {
  onReturnToPublic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnToPublic }) => {
  const { adminUser, loginAdmin, logoutAdmin, currentSession } = useMSSNStore();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState<boolean>(false);

  const currentRole = adminUser?.role || 'super_admin';
  const roleDetail = getRoleDetail(currentRole);
  const allowedSections = getAllowedSections(currentRole);

  // All potential nav items
  const allNavItems: { id: AdminSection; label: string; icon: React.ReactNode; dutyDescription: string }[] = [
    {
      id: 'overview',
      label: 'Overview & Stats',
      icon: <LayoutDashboard className="w-4 h-4" />,
      dutyDescription: 'Executive dashboard KPIs & quick metrics'
    },
    {
      id: 'site_content',
      label: 'Live Website CMS',
      icon: <Globe className="w-4 h-4" />,
      dutyDescription: 'Hero banner slides, ticker notices & homepage settings'
    },
    {
      id: 'elibrary',
      label: 'E-Library & Archives',
      icon: <BookOpen className="w-4 h-4" />,
      dutyDescription: 'Downloadable past questions, handouts & constitution'
    },
    {
      id: 'faqs',
      label: 'FAQ Knowledgebase',
      icon: <Info className="w-4 h-4" />,
      dutyDescription: 'Student questions, registration help & guide answers'
    },
    {
      id: 'members',
      label: 'Member Registry',
      icon: <Users className="w-4 h-4" />,
      dutyDescription: 'Student registration records & member details'
    },
    {
      id: 'executives',
      label: 'Executive Council',
      icon: <Award className="w-4 h-4" />,
      dutyDescription: 'Council leadership portfolios & profiles'
    },
    {
      id: 'committees',
      label: 'Committees & Wings',
      icon: <BookOpen className="w-4 h-4" />,
      dutyDescription: 'Committee structures, Da\'wah & Sisters Wings'
    },
    {
      id: 'events',
      label: 'Programs & Events',
      icon: <CalendarDays className="w-4 h-4" />,
      dutyDescription: 'Jihad Week, academic lectures & conferences'
    },
    {
      id: 'gallery',
      label: 'Photo Gallery',
      icon: <Image className="w-4 h-4" />,
      dutyDescription: 'Event media coverage, albums & photos'
    },
    {
      id: 'blog',
      label: 'Articles & Blog',
      icon: <FileText className="w-4 h-4" />,
      dutyDescription: 'Islamic publications, newsletters & press'
    },
    {
      id: 'donations',
      label: 'Sadaqah & Welfare',
      icon: <HeartHandshake className="w-4 h-4" />,
      dutyDescription: 'Student welfare funds & donor management'
    },
    {
      id: 'sessions',
      label: 'Academic Sessions',
      icon: <Calendar className="w-4 h-4" />,
      dutyDescription: 'Session archives, transitions & tenure records'
    },
    {
      id: 'settings',
      label: 'Platform Settings',
      icon: <Settings className="w-4 h-4" />,
      dutyDescription: 'System configurations, security & audit logs'
    }
  ];

  // Filter navigation items to ONLY those allowed for this role
  const permittedNavItems = allNavItems.filter((item) => isSectionAllowed(currentRole, item.id));

  // If user is currently on an unauthorized section, reset to their first allowed section
  useEffect(() => {
    if (!isSectionAllowed(currentRole, activeSection)) {
      setActiveSection(allowedSections[0] || 'overview');
    }
  }, [currentRole, activeSection, allowedSections]);

  const handleLogout = () => {
    logoutAdmin();
    onReturnToPublic();
  };

  const handleSwitchRole = (newRole: AdminRole) => {
    const newDetail = getRoleDetail(newRole);
    if (adminUser) {
      loginAdmin({
        ...adminUser,
        role: newRole,
        portfolio: newDetail.portfolio,
        fullName: `${adminUser.name || 'Hon. Official'} (${newDetail.title})`
      });
    }
    setShowRoleSwitcher(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col md:flex-row font-sans text-[#2D332D]">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#1B4332] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-[#143527]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-sm tracking-tight text-white font-serif">
            MSSNFUD Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-emerald-950">
            {roleDetail.shortName}
          </span>
          <button
            onClick={onReturnToPublic}
            className="text-xs text-[#C29A5B] font-bold flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public</span>
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#1B4332] text-[#F0F2ED] border-r border-[#143527] flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Active Officer Profile */}
        <div className="p-5 border-b border-[#143527] space-y-3">
          <HeaderBrand size="sm" variant="light" />

          {/* User Profile & Role Card */}
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-[#C29A5B] text-[#1B4332] text-[10px] font-black uppercase tracking-wide">
                {roleDetail.title}
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <p className="font-extrabold text-xs text-white truncate" title={adminUser?.fullName}>
                {adminUser?.fullName || adminUser?.name}
              </p>
              <p className="text-[10px] text-[#C29A5B] font-medium leading-tight mt-0.5">
                {roleDetail.portfolio}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#F0F2ED]/70">
              <span>Session: {currentSession.name}</span>
              <button
                type="button"
                onClick={() => setShowRoleSwitcher(true)}
                className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                title="Switch administrative role for testing"
              >
                Switch Role
              </button>
            </div>
          </div>
        </div>

        {/* Permitted Duties & Navigation Links */}
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          <div className="px-3 py-1 flex items-center justify-between text-[10px] uppercase font-black tracking-wider text-[#C29A5B]">
            <span>Assigned Duties ({permittedNavItems.length})</span>
            <ShieldCheck className="w-3 h-3 text-[#C29A5B]" />
          </div>

          {permittedNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C29A5B] text-[#1B4332] shadow-xs font-bold'
                    : 'text-[#F0F2ED] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-[#1B4332]' : 'text-[#C29A5B]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Notice of Restricted Modules */}
          {currentRole !== 'super_admin' && (
            <div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300/80 text-[10px] font-bold">
                <Lock className="w-3 h-3" />
                <span>Role Boundary Active</span>
              </div>
              <p className="text-[10px] text-[#F0F2ED]/60 leading-relaxed">
                Access is restricted to duties relating to the <strong>{roleDetail.title}</strong> portfolio.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#143527] space-y-2">
          <button
            onClick={onReturnToPublic}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#F0F2ED] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#C29A5B]" />
            <span>Go to Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-black/20 hover:bg-black/40 text-rose-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-rose-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas with Role Boundary Guard */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Role Boundary Notice Banner */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${roleDetail.badgeBg} ${roleDetail.badgeText}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">
                  {roleDetail.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  • {roleDetail.portfolio}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {roleDetail.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setShowRoleSwitcher(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>Switch Role</span>
            </button>
          </div>
        </div>

        {/* Active Section Rendering with Access Verification */}
        {isSectionAllowed(currentRole, activeSection) ? (
          <>
            {activeSection === 'overview' && (
              <AdminOverview
                onNavigate={(sec) => setActiveSection(sec as AdminSection)}
                onOpenAddMember={() => setShowRegistrationModal(true)}
              />
            )}

            {activeSection === 'site_content' && <AdminSiteContent />}

            {activeSection === 'elibrary' && <AdminELibrary />}

            {activeSection === 'faqs' && <AdminFAQs />}

            {activeSection === 'members' && (
              <AdminMembers onOpenAddMember={() => setShowRegistrationModal(true)} />
            )}

            {activeSection === 'sessions' && <AdminSessions />}

            {activeSection === 'executives' && <AdminExecutives />}

            {activeSection === 'committees' && <AdminCommittees />}

            {activeSection === 'events' && <AdminEvents />}

            {activeSection === 'gallery' && <AdminGallery />}

            {activeSection === 'blog' && <AdminBlog />}

            {activeSection === 'donations' && <AdminDonations />}

            {activeSection === 'settings' && <AdminSettings />}
          </>
        ) : (
          /* Unauthorized Access Guard */
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-slate-900">
                Access Restricted to Designated Officers
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your currently logged-in role (<strong>{roleDetail.title}</strong>) does not have access permissions for the <strong>{activeSection}</strong> module.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActiveSection(allowedSections[0] || 'overview')}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Return to My Assigned Duties
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Role Switcher Modal for Easy Portfolio Verification */}
      {showRoleSwitcher && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-extrabold">Executive Role & Duty Selector</h3>
                  <p className="text-xs text-emerald-200">Select an officer role to view their specific duty scope</p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleSwitcher(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[75vh] overflow-y-auto text-xs">
              {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((rKey) => {
                const r = ROLE_DEFINITIONS[rKey];
                const isSelected = currentRole === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => handleSwitchRole(r.role)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:border-emerald-400 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {r.title}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-white text-[9px] font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {r.allowedSections.length} duties
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      {r.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {r.allowedSections.map((sec) => (
                        <span
                          key={sec}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reusable Member Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </div>
  );
};
