import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { AdminRole } from '../../types';
import { DualLogo } from '../common/DualLogo';
import { ROLE_DEFINITIONS, getRoleDetail } from '../../utils/rbac';
import { AdminDashboard } from './AdminDashboard';
import {
  ShieldCheck,
  User,
  KeyRound,
  AlertCircle,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AdminPortalProps {
  onReturnToPublic: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onReturnToPublic }) => {
  const { adminUser, loginAdmin } = useMSSNStore();
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('mssnfud2025');
  const [role, setRole] = useState<AdminRole>('super_admin');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // If already logged in as admin, render full dashboard
  if (adminUser) {
    return <AdminDashboard onReturnToPublic={onReturnToPublic} />;
  }

  const currentRoleDetail = getRoleDetail(role);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (password.trim().length < 3) {
        setError('Password must be at least 3 characters.');
        setIsLoading(false);
        return;
      }

      const roleDetail = getRoleDetail(role);

      loginAdmin({
        id: `admin-${Date.now()}`,
        username: username.trim(),
        name: `Hon. ${username.charAt(0).toUpperCase() + username.slice(1)}`,
        fullName: `Hon. ${username.charAt(0).toUpperCase() + username.slice(1)} (${roleDetail.title})`,
        role: role,
        portfolio: roleDetail.portfolio,
        email: `${username.toLowerCase()}@mssnfud.org.ng`,
        session: '2026/2027'
      });

      setIsLoading(false);
    }, 350);
  };

  const handleQuickFill = (u: string, r: AdminRole) => {
    setUsername(u);
    setPassword('mssnfud2025');
    setRole(r);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-700 selection:text-white relative overflow-hidden">
      {/* Background Islamic Geometric Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,81,50,0.35),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_40%)] pointer-events-none" />

      {/* Top Bar with Return Link */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          onClick={onReturnToPublic}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-emerald-400" />
          <span>Return to Public Website</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono">MSSNFUD Secure Administrative Gateway</span>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-xl bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F5132] via-[#0D442A] to-[#0A3622] p-6 sm:p-8 border-b border-emerald-800/60 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <DualLogo size="md" variant="light" showTogether={true} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                      Authorized Officers
                    </span>
                    <span className="text-[11px] text-emerald-200 font-mono">
                      Session 2026/2027
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Executive Portal Access
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-200 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Officer Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-600 text-xs text-white font-medium outline-none bg-slate-900/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-500"
                    placeholder="Enter executive ID..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Security Passcode *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-600 text-xs text-white font-medium outline-none bg-slate-900/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Select Executive Portfolio / Duty Role
                </label>
                <span className="text-[10px] font-bold text-amber-400 font-mono">
                  {currentRoleDetail.allowedSections.length} Permitted Modules
                </span>
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-600 text-xs font-bold text-white outline-none bg-slate-900/90 focus:border-emerald-500 cursor-pointer"
              >
                {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((rKey) => (
                  <option key={rKey} value={rKey} className="bg-slate-900 text-white">
                    {ROLE_DEFINITIONS[rKey].title} — ({ROLE_DEFINITIONS[rKey].shortName})
                  </option>
                ))}
              </select>
              <div className="mt-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-0.5">
                  Portfolio Scope:
                </span>
                {currentRoleDetail.description}
              </div>
            </div>

            {/* Quick Demo Test Logins */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/60 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Role Credentials for Testing:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('superadmin', 'super_admin')}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-semibold text-center truncate transition-all cursor-pointer ${
                    role === 'super_admin'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('amir_nasirudeen', 'amir')}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-semibold text-center truncate transition-all cursor-pointer ${
                    role === 'amir'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Amir / President
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('fin_sec', 'financial_sec')}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-semibold text-center truncate transition-all cursor-pointer ${
                    role === 'financial_sec'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Finance Sec
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('gen_sec', 'secretary')}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-semibold text-center truncate transition-all cursor-pointer ${
                    role === 'secretary'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Gen. Secretary
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('dos_lectures', 'dos')}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-semibold text-center truncate transition-all cursor-pointer ${
                    role === 'dos'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Dir. of Studies
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('pro_media', 'media')}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-semibold text-center truncate transition-all cursor-pointer ${
                    role === 'media'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Publicity / Media
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Authenticating Officer...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Enter {currentRoleDetail.shortName} Executive Workspace</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 py-4 px-4 text-center text-xs text-slate-500">
        MSSN Federal University Dutse Chapter • Administrative Operations Console
      </footer>
    </div>
  );
};
