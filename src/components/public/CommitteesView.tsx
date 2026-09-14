import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { Committee } from '../../types';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';

interface CommitteesViewProps {
  onOpenRegistration: (initialCommittee?: string) => void;
}

export const CommitteesView: React.FC<CommitteesViewProps> = ({
  onOpenRegistration
}) => {
  const { committees } = useMSSNStore();
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in bg-[#F8F9FA] text-slate-800">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] text-xs font-bold uppercase tracking-wider border border-emerald-200">
          <BookOpen className="w-4 h-4 text-[#0F5132]" />
          MSSN FUD Directorates & Wings
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Committees & Working Groups
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our specialized committees drive spiritual development, welfare relief, free faculty tutorials, media, and campus events.
        </p>
      </div>

      {/* Committees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {committees.map((comm) => (
          <div
            key={comm.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-[#0F5132] hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Top icon and tag */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase font-mono">
                  {comm.activeSession}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {comm.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                  {comm.shortDescription}
                </p>
              </div>

              {/* Meeting Schedule */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#0F5132] shrink-0" />
                <span className="line-clamp-1 font-medium">{comm.meetingSchedule}</span>
              </div>

              {/* Head Officer */}
              <div className="flex items-center gap-2.5 pt-1">
                {comm.headPhoto ? (
                  <img
                    src={comm.headPhoto}
                    alt={comm.headName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-600"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#0F5132] font-bold flex items-center justify-center text-xs">
                    {comm.headName.charAt(0)}
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Committee Head
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {comm.headName}
                  </h4>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCommittee(comm)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Objectives
              </button>

              <button
                onClick={() => onOpenRegistration(comm.name)}
                className="px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Join Wing</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Committee Details Modal */}
      {selectedCommittee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-[#0F5132] text-white p-5 relative">
              <button
                onClick={() => setSelectedCommittee(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-900 font-black flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {selectedCommittee.name}
                  </h3>
                  <p className="text-emerald-100 text-xs mt-0.5">
                    Federal University Dutse Chapter • {selectedCommittee.activeSession}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-1.5">
                  Scope & Responsibilities
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedCommittee.fullDescription}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-1.5">
                  Key Objectives
                </h4>
                <ul className="space-y-1.5">
                  {selectedCommittee.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Leadership & Schedule Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase block mb-0.5">
                    Meeting Times & Venue
                  </span>
                  <p className="font-semibold text-slate-800">
                    {selectedCommittee.meetingSchedule}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase block mb-0.5">
                    Committee Leadership
                  </span>
                  <p className="font-bold text-slate-800">
                    Head: {selectedCommittee.headName}
                  </p>
                  {selectedCommittee.secretaryName && (
                    <p className="text-slate-500 mt-0.5">
                      Secretary: {selectedCommittee.secretaryName}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedCommittee(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    const name = selectedCommittee.name;
                    setSelectedCommittee(null);
                    onOpenRegistration(name);
                  }}
                  className="px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold rounded-lg shadow-xs text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Enroll in this Committee</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
