import React from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { isSectionAllowed, getRoleDetail } from '../../utils/rbac';
import {
  Users,
  Calendar,
  HeartHandshake,
  BookOpen,
  Award,
  Plus,
  Download,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  Building,
  Sparkles,
  Image,
  FileText,
  ShieldCheck,
  ArrowRight,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigate: (section: string) => void;
  onOpenAddMember: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigate,
  onOpenAddMember
}) => {
  const {
    adminUser,
    currentSession,
    members,
    sessions,
    executives,
    committees,
    events,
    causes,
    donations,
    gallery,
    articles,
    siteContent,
    setRegistrationStatus,
    exportMembersCSV
  } = useMSSNStore();

  const currentRole = adminUser?.role || 'super_admin';
  const roleDetail = getRoleDetail(currentRole);
  const isSuperAdmin = currentRole === 'super_admin';
  const isRegistrationOpen = siteContent?.isRegistrationOpen !== false;

  const totalDonations = donations.reduce((acc, d) => acc + d.amount, 0);
  const activeCauses = causes.filter((c) => c.isActive).length;
  const upcomingEventsCount = events.filter((e) => e.status === 'upcoming').length;

  // Faculty distribution
  const facultyCounts: Record<string, number> = {};
  members.forEach((m) => {
    facultyCounts[m.faculty] = (facultyCounts[m.faculty] || 0) + 1;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Super Admin Quick Registration & Session Hub */}
      {isSuperAdmin && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isRegistrationOpen
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isRegistrationOpen ? (
                <Unlock className="w-6 h-6" />
              ) : (
                <Lock className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Membership Registration is{' '}
                  <span
                    className={
                      isRegistrationOpen ? 'text-emerald-700' : 'text-rose-600'
                    }
                  >
                    {isRegistrationOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-700 font-mono">
                  {currentSession.name} Session
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRegistrationOpen
                  ? 'Prospective and returning students can register online and obtain digital e-ID cards.'
                  : 'Public registration is temporarily closed. Regular visitors see the secretariat inquiry notice.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <button
              onClick={() =>
                setRegistrationStatus(!isRegistrationOpen, siteContent?.registrationNotice)
              }
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                isRegistrationOpen
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              {isRegistrationOpen ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Close Registration</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open Registration</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('sessions')}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Manage Sessions</span>
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner Tailored to Role */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider">
              {roleDetail.title}
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Academic Session: {currentSession.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {adminUser?.fullName || adminUser?.name}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
            {roleDetail.description}
          </p>
        </div>

        {/* Action Shortcuts Permitted for Role */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          {isSectionAllowed(currentRole, 'members') && (
            <>
              <button
                onClick={onOpenAddMember}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 text-emerald-950" />
                <span>New Member</span>
              </button>

              <button
                onClick={exportMembersCSV}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs border border-emerald-600 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Export CSV</span>
              </button>
            </>
          )}

          {isSectionAllowed(currentRole, 'events') && !isSectionAllowed(currentRole, 'members') && (
            <button
              onClick={() => onNavigate('events')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Calendar className="w-4 h-4 text-emerald-950" />
              <span>Manage Programs</span>
            </button>
          )}

          {isSectionAllowed(currentRole, 'donations') && !isSectionAllowed(currentRole, 'members') && (
            <button
              onClick={() => onNavigate('donations')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-950" />
              <span>Welfare Appeals</span>
            </button>
          )}

          {isSectionAllowed(currentRole, 'gallery') && (
            <button
              onClick={() => onNavigate('gallery')}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs border border-emerald-600 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Image className="w-4 h-4 text-amber-300" />
              <span>Media Gallery</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Metric Cards for Assigned Duties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {isSectionAllowed(currentRole, 'members') && (
          <div
            onClick={() => onNavigate('members')}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Members
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {members.length}
            </p>
            <span className="text-[11px] font-semibold text-emerald-700 block">
              {members.filter((m) => m.session === currentSession.name).length} active in session {currentSession.name}
            </span>
          </div>
        )}

        {isSectionAllowed(currentRole, 'donations') && (
          <div
            onClick={() => onNavigate('donations')}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sadaqah Raised
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              ₦{totalDonations.toLocaleString()}
            </p>
            <span className="text-[11px] font-semibold text-slate-500 block">
              {activeCauses} active student welfare appeals
            </span>
          </div>
        )}

        {isSectionAllowed(currentRole, 'events') && (
          <div
            onClick={() => onNavigate('events')}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Upcoming Programs
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {upcomingEventsCount}
            </p>
            <span className="text-[11px] font-semibold text-amber-700 block">
              {events.length} total scheduled events
            </span>
          </div>
        )}

        {isSectionAllowed(currentRole, 'committees') && (
          <div
            onClick={() => onNavigate('committees')}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Committees & Wings
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {committees.length}
            </p>
            <span className="text-[11px] font-semibold text-teal-700 block">
              {executives.filter((e) => e.session === currentSession.name).length} current council officers
            </span>
          </div>
        )}

        {isSectionAllowed(currentRole, 'gallery') && (
          <div
            onClick={() => onNavigate('gallery')}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Photo Gallery Assets
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {gallery.length}
            </p>
            <span className="text-[11px] font-semibold text-indigo-700 block">
              Event coverage & photo albums
            </span>
          </div>
        )}

        {isSectionAllowed(currentRole, 'blog') && (
          <div
            onClick={() => onNavigate('blog')}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Articles & Publications
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {articles.length}
            </p>
            <span className="text-[11px] font-semibold text-purple-700 block">
              Published Da'wah articles
            </span>
          </div>
        )}
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Faculty Enrollment Breakdown (Only if member management is part of duties or superadmin) */}
        {isSectionAllowed(currentRole, 'members') ? (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-700" />
                <span>Membership by Faculty</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {Object.keys(facultyCounts).length} Faculties
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(facultyCounts).map(([faculty, count]) => {
                const pct = Math.round((count / Math.max(1, members.length)) * 100);
                return (
                  <div key={faculty} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 truncate max-w-[240px]">{faculty}</span>
                      <span className="text-emerald-800 font-mono">{count} members ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Portfolio Duties Overview Card */
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Assigned Portfolio Duties</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700">
                {roleDetail.title}
              </span>
            </div>

            <div className="space-y-2.5">
              {roleDetail.allowedSections.map((sec) => (
                <div
                  key={sec}
                  onClick={() => onNavigate(sec)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="font-extrabold text-xs text-slate-900 capitalize">
                      {sec}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Registered Members or Quick Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Recent Member Activity</span>
              </h3>
              {isSectionAllowed(currentRole, 'members') && (
                <button
                  onClick={() => onNavigate('members')}
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  View All
                </button>
              )}
            </div>

            <div className="space-y-2">
              {members.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.photoUrl}
                      alt={m.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-600"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{m.fullName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{m.membershipId} • {m.department}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Official MSSNFUD Council Node</span>
            <span className="font-semibold text-emerald-800">Role Verification Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
