import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { AcademicSession } from '../../types';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Save,
  Clock,
  Lock,
  Unlock,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AdminSessions: React.FC = () => {
  const {
    sessions,
    currentSession,
    addSession,
    updateSession,
    deleteSession,
    setCurrentSession,
    siteContent,
    setRegistrationStatus,
    members,
    adminUser
  } = useMSSNStore();

  const isSuperAdmin = adminUser?.role === 'super_admin' || !adminUser?.role;
  const isRegistrationOpen = siteContent?.isRegistrationOpen !== false;

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);

  // Form state for add
  const [sessionName, setSessionName] = useState<string>('2026/2027');
  const [theme, setTheme] = useState<string>('Excellence in Knowledge & Character');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2027-08-30');

  // Form state for edit
  const [editName, setEditName] = useState<string>('');
  const [editTheme, setEditTheme] = useState<string>('');
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editEndDate, setEditEndDate] = useState<string>('');

  const [noticeMessage, setNoticeMessage] = useState<string>(
    siteContent?.registrationNotice || ''
  );
  const [isEditingNotice, setIsEditingNotice] = useState<boolean>(false);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    addSession({
      name: sessionName.trim(),
      isCurrent: false,
      startDate,
      endDate,
      theme: theme.trim()
    });

    setShowAddModal(false);
    setSessionName('');
    setTheme('');
  };

  const handleOpenEdit = (sess: AcademicSession) => {
    setEditingSession(sess);
    setEditName(sess.name);
    setEditTheme(sess.theme || '');
    setEditStartDate(sess.startDate || '');
    setEditEndDate(sess.endDate || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !editName.trim()) return;

    updateSession(editingSession.id, {
      name: editName.trim(),
      theme: editTheme.trim(),
      startDate: editStartDate,
      endDate: editEndDate
    });

    setEditingSession(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (sessions.length <= 1) {
      alert('You cannot delete the only existing academic session.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete session "${name}"? Existing member records will remain archived.`)) {
      deleteSession(id);
    }
  };

  const handleToggleRegistration = () => {
    setRegistrationStatus(!isRegistrationOpen, siteContent?.registrationNotice);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStatus(isRegistrationOpen, noticeMessage);
    setIsEditingNotice(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Super Admin Registration Control Hub */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] uppercase tracking-wider">
                Super Admin Privilege
              </span>
              <span className="text-xs text-emerald-300 font-mono">
                Active Session: {currentSession.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Membership Registration & Session Control
            </h2>
            <p className="text-xs text-emerald-200/90 max-w-xl leading-relaxed">
              Open or close the public online student registration portal and choose which academic session is assigned to new applicants and digital ID cards.
            </p>
          </div>

          {/* Quick Registration Status Toggle Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Portal Status
              </span>
              <span
                className={`font-black text-sm ${
                  isRegistrationOpen ? 'text-emerald-300' : 'text-rose-400'
                }`}
              >
                {isRegistrationOpen ? '● OPEN TO STUDENTS' : '● CLOSED'}
              </span>
            </div>

            <button
              onClick={handleToggleRegistration}
              className={`px-5 py-3 rounded-2xl font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                isRegistrationOpen
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
              }`}
            >
              {isRegistrationOpen ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Close Registration Portal</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Open Registration Portal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Status Bar & Notice Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
              Current Active Session
            </span>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{currentSession.name}</h3>
              <span className="px-2 py-0.5 bg-amber-400 text-emerald-950 font-bold text-[10px] rounded-md">
                Active Default
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              New members registered online will be assigned to this session.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-1">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
              Total Enrolled Members
            </span>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                {members.filter((m) => m.session === currentSession.name).length}
                <span className="text-xs font-normal text-emerald-300 ml-1">
                  in this session
                </span>
              </h3>
              <Users className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-[11px] text-emerald-200/80">
              {members.length} cumulative members registered across all sessions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
                  Registration Notice Message
                </span>
                <button
                  onClick={() => {
                    setNoticeMessage(siteContent?.registrationNotice || '');
                    setIsEditingNotice(!isEditingNotice);
                  }}
                  className="text-[11px] text-amber-300 hover:text-amber-200 underline font-bold cursor-pointer"
                >
                  {isEditingNotice ? 'Cancel' : 'Edit Notice'}
                </button>
              </div>
              <p className="text-[11px] text-emerald-100 line-clamp-2 mt-1">
                {siteContent?.registrationNotice || 'Standard default notice displayed.'}
              </p>
            </div>
          </div>
        </div>

        {/* Notice Edit Modal / Inline Area */}
        {isEditingNotice && (
          <form
            onSubmit={handleSaveNotice}
            className="bg-emerald-950/80 border border-emerald-700 p-4 rounded-2xl space-y-3 animate-fade-in"
          >
            <label className="block text-xs font-bold text-emerald-200">
              Custom Registration Banner / Closed Notice:
            </label>
            <textarea
              rows={2}
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              placeholder="e.g. Online registration for the 2026/2027 session is currently closed. Please contact the Secretariat."
              className="w-full px-3 py-2 bg-emerald-900/60 border border-emerald-600 rounded-xl text-white text-xs outline-none focus:border-amber-400 placeholder:text-emerald-400"
            ></textarea>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingNotice(false)}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notice</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Academic Sessions Header & List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Academic Sessions Registry
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure tenures, themes, switch active registration session, or archive past academic years.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Academic Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sessions.map((sess) => {
          const isCurrent = sess.isCurrent || sess.id === currentSession.id;
          const sessionMembers = members.filter((m) => m.session === sess.name);

          return (
            <div
              key={sess.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                isCurrent
                  ? 'bg-gradient-to-br from-emerald-900 to-emerald-950 text-white border-emerald-700 shadow-xl'
                  : 'bg-white text-slate-900 border-slate-200 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      isCurrent
                        ? 'bg-amber-400 text-emerald-950'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isCurrent ? 'Current Active Session' : 'Archived Tenure'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(sess)}
                      title="Edit Session Details"
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isCurrent
                          ? 'text-emerald-200 hover:text-white hover:bg-white/10'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={() => handleDelete(sess.id, sess.name)}
                        title="Delete Session"
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black">{sess.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-mono ${
                        isCurrent ? 'text-emerald-300' : 'text-slate-500'
                      }`}
                    >
                      {sess.startDate ? `${sess.startDate} → ${sess.endDate || 'Present'}` : 'Full Academic Tenure'}
                    </span>
                  </div>
                </div>

                {sess.theme && (
                  <p
                    className={`text-xs italic leading-relaxed ${
                      isCurrent ? 'text-emerald-100' : 'text-slate-600'
                    }`}
                  >
                    Theme: "{sess.theme}"
                  </p>
                )}

                <div
                  className={`pt-2 border-t text-xs flex items-center justify-between ${
                    isCurrent ? 'border-emerald-800/80 text-emerald-200' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span>Enrolled Members:</span>
                  <span className="font-bold font-mono text-sm">{sessionMembers.length}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/20 flex items-center justify-between">
                {isCurrent ? (
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Active for Registrations</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentSession(sess.id)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-bold text-xs border border-slate-300 transition-colors cursor-pointer text-center"
                  >
                    Set as Active Session
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold">Create Academic Session</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Session Name (e.g. 2026/2027) *
                </label>
                <input
                  type="text"
                  required
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g. 2026/2027"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Session Theme & Motto
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Steadfastness in Faith & Scholarship"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold">Edit Academic Session</h3>
              <button
                onClick={() => setEditingSession(null)}
                className="p-1 text-emerald-200 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Session Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Session Theme & Motto
                </label>
                <input
                  type="text"
                  value={editTheme}
                  onChange={(e) => setEditTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Session</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
