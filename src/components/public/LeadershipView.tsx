import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import {
  Users,
  Award,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const LeadershipView: React.FC = () => {
  const { sessions, currentSession, executives } = useMSSNStore();
  const [selectedSession, setSelectedSession] = useState<string>(currentSession.name);

  // Filter executives for selected session
  const filteredExecutives = executives
    .filter((e) => e.session === selectedSession)
    .sort((a, b) => a.order - b.order);

  const selectedSessionObj = sessions.find((s) => s.name === selectedSession);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <Users className="w-4 h-4 text-emerald-700" />
          Executive Leadership Council
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Executive Council & Past Shura
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Dedicated servant leaders coordinating spiritual tarbiyyah, academic tutoring, and student welfare across Federal University Dutse.
        </p>
      </div>

      {/* Academic Session Archive Switcher */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Academic Session Tenure
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>{selectedSession} Executive Council</span>
            {selectedSession === currentSession.name && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Current Active
              </span>
            )}
          </h3>
          {selectedSessionObj?.theme && (
            <p className="text-xs text-emerald-800 italic mt-0.5 font-medium">
              Theme: "{selectedSessionObj.theme}"
            </p>
          )}
        </div>

        {/* Session Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {sessions.map((s) => {
            const isSelected = selectedSession === s.name;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSession(s.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.name} {s.isCurrent ? '(Current)' : '(Archive)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Executive Council Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExecutives.map((exec) => (
          <div
            key={exec.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            {/* Top Photo Banner */}
            <div className="relative h-60 overflow-hidden bg-slate-100">
              <img
                src={exec.photoUrl}
                alt={exec.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent"></div>

              {/* Arabic Portfolio Title Overlay */}
              {exec.arabicTitle && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-900/90 text-amber-300 font-arabic text-xs font-bold">
                  {exec.arabicTitle}
                </div>
              )}

              {/* Position Tag on bottom */}
              <div className="absolute bottom-3 inset-x-3 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
                  {exec.portfolio}
                </span>
                <h3 className="font-extrabold text-base leading-snug line-clamp-1">
                  {exec.name}
                </h3>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{exec.department}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {exec.level}
                  </span>
                </div>

                {exec.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                    "{exec.bio}"
                  </p>
                )}
              </div>

              {/* Contact Lines (if provided) */}
              {(exec.email || exec.phone) && (
                <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                  {exec.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span className="truncate">{exec.email}</span>
                    </div>
                  )}
                  {exec.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>{exec.phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredExecutives.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500 space-y-2">
          <p className="font-bold text-slate-700">No executive records found for session {selectedSession}.</p>
          <p className="text-xs">Records can be added via the login-protected Admin Portal.</p>
        </div>
      )}
    </div>
  );
};
