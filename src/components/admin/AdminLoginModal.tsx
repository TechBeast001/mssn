import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { AdminRole } from '../../types';
import { DualLogo } from '../common/DualLogo';
import { ROLE_DEFINITIONS, getRoleDetail } from '../../utils/rbac';
import {
  ShieldCheck,
  User,
  KeyRound,
  X,
  AlertCircle,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { loginAdmin } = useMSSNStore();
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('mssnfud2025');
  const [role, setRole] = useState<AdminRole>('super_admin');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

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
      onLoginSuccess();
    }, 300);
  };

  const handleQuickFill = (u: string, r: AdminRole) => {
    setUsername(u);
    setPassword('mssnfud2025');
    setRole(r);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-[#0F5132] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <DualLogo size="sm" showTogether={true} />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Official Access
              </span>
              <h3 className="text-lg font-bold text-white">
                Admin & Executive Portal
              </h3>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium outline-none bg-white focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132]"
                placeholder="Enter username..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium outline-none bg-white focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Official Executive Role
              </label>
              <span className="text-[10px] font-bold text-emerald-800">
                {currentRoleDetail.allowedSections.length} duties
              </span>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none bg-white focus:border-[#0F5132]"
            >
              {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((rKey) => (
                <option key={rKey} value={rKey}>
                  {ROLE_DEFINITIONS[rKey].title} — ({ROLE_DEFINITIONS[rKey].shortName})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">
              {currentRoleDetail.description}
            </p>
          </div>

          {/* Quick Demo Pre-fill Pills */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Role Test Logins
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('superadmin', 'super_admin')}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-center truncate transition-colors cursor-pointer ${
                  role === 'super_admin'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('amir_nasirudeen', 'amir')}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-center truncate transition-colors cursor-pointer ${
                  role === 'amir'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Amir
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('fin_sec', 'financial_sec')}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-center truncate transition-colors cursor-pointer ${
                  role === 'financial_sec'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Finance Sec
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('gen_sec', 'secretary')}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-center truncate transition-colors cursor-pointer ${
                  role === 'secretary'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Gen. Secretary
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('dos_lectures', 'dos')}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-center truncate transition-colors cursor-pointer ${
                  role === 'dos'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Dir. of Studies
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('pro_media', 'media')}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold text-center truncate transition-colors cursor-pointer ${
                  role === 'media'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Media / PRO
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Access {currentRoleDetail.shortName} Portal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
