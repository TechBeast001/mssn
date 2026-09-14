import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import {
  Settings,
  Megaphone,
  Building,
  Save,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Calendar,
  ShieldCheck,
  Share2
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const {
    siteContent,
    updateSiteContent,
    resetToDefaults,
    sessions,
    currentSession,
    setCurrentSession,
    adminUser
  } = useMSSNStore();

  const [formData, setFormData] = useState({
    ...siteContent,
    isRegistrationOpen: siteContent.isRegistrationOpen !== false,
    registrationNotice: siteContent.registrationNotice || ''
  });

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    currentSession?.id || sessions[0]?.id || ''
  );

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(formData);
    if (selectedSessionId && selectedSessionId !== currentSession.id) {
      setCurrentSession(selectedSessionId);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'WARNING: Are you sure you want to reset all database records (members, events, articles, sessions) to default seed data?'
      )
    ) {
      resetToDefaults();
      alert('Application records reset to defaults successfully.');
    }
  };

  const handleDownloadBackup = () => {
    const raw = localStorage.getItem('mssnfud_site_content_v1') || '{}';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mssnfud_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Settings className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Platform Settings & Super Admin Control
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Control student registration access, active academic session, announcement tickers, and secretariat contacts.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Super Admin Membership Registration Control */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-sm space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Student Membership Registration Control
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Super Admin control to open/close public registration and assign the active academic session.
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                formData.isRegistrationOpen
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {formData.isRegistrationOpen ? 'Portal Open' : 'Portal Closed'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Status Toggle */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800">
                Online Registration Status
              </label>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                When closed, students will see an official closed notice and will not be able to submit new registrations.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isRegistrationOpen: true })
                  }
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    formData.isRegistrationOpen
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Open (Accepting Registrations)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isRegistrationOpen: false })
                  }
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    !formData.isRegistrationOpen
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Close Registration</span>
                </button>
              </div>
            </div>

            {/* Active Academic Session Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800">
                Active Registration Session
              </label>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Select the academic session that will be stamped on new membership IDs and digital e-ID cards.
              </p>
              <div className="pt-2">
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono font-bold text-xs outline-none focus:border-emerald-700"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.isCurrent ? '(Currently Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Registration Notice */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Public Registration Status Notice / Closed Message
            </label>
            <textarea
              rows={2}
              value={formData.registrationNotice}
              onChange={(e) =>
                setFormData({ ...formData, registrationNotice: e.target.value })
              }
              placeholder="e.g. Online registration for the 2026/2027 Academic Session is currently closed. For inquiries, please contact the Secretariat."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
            ></textarea>
          </div>
        </div>

        {/* Announcement Ticker Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Top Announcement Ticker Banner
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tickerToggle"
                checked={formData.isAnnouncementActive}
                onChange={(e) =>
                  setFormData({ ...formData, isAnnouncementActive: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
              <label htmlFor="tickerToggle" className="font-bold text-slate-700 cursor-pointer">
                Display Banner on Public Site
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Banner Announcement Text
            </label>
            <input
              type="text"
              value={formData.announcementTicker}
              onChange={(e) =>
                setFormData({ ...formData, announcementTicker: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Secretariat Contacts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-emerald-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Secretariat Location & Hotlines
            </h3>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Physical Secretariat Address
            </label>
            <input
              type="text"
              value={formData.secretariatAddress}
              onChange={(e) =>
                setFormData({ ...formData, secretariatAddress: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Secretariat Hotline
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Official Social Media Channels */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Share2 className="w-4 h-4 text-emerald-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Official Social Media Handles
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                TikTok URL (@mssnfud)
              </label>
              <input
                type="url"
                value={formData.tiktokUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, tiktokUrl: e.target.value })
                }
                placeholder="https://www.tiktok.com/@mssnfud?..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, facebookUrl: e.target.value })
                }
                placeholder="https://www.facebook.com/share/..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                X (Twitter) Profile URL (@FudMssn)
              </label>
              <input
                type="url"
                value={formData.twitterUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, twitterUrl: e.target.value })
                }
                placeholder="https://x.com/FudMssn"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                WhatsApp Channel / Secretariat Chat Link
              </label>
              <input
                type="text"
                value={formData.whatsappUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappUrl: e.target.value })
                }
                placeholder="https://wa.me/2348031234567"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Chapter Mission & Vision Text
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Vision Statement</label>
            <textarea
              rows={2}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mission Statement</label>
            <textarea
              rows={2}
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 outline-none"
            ></textarea>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Danger Zone & Data Backup */}
      <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>System Data Management & Reset</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          You can download a complete JSON backup of the current database (members, events, gallery, sessions, causes) or restore default seed data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-800" />
            <span>Download Database JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset All Records to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
