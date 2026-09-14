import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { Committee } from '../../types';
import {
  BookOpen,
  Edit2,
  X,
  Save,
  Plus,
  Trash2,
  Clock,
  UserCheck
} from 'lucide-react';

export const AdminCommittees: React.FC = () => {
  const { committees, updateCommittee, addCommittee } = useMSSNStore();
  const [editingComm, setEditingComm] = useState<Committee | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComm) return;
    updateCommittee(editingComm.id, editingComm);
    setEditingComm(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Committees & Working Groups
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure objectives, chairpersons, and meeting times for the 9 official chapters wings.
          </p>
        </div>
      </div>

      {/* Committees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committees.map((comm) => (
          <div
            key={comm.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase">
                  {comm.activeSession}
                </span>
                <button
                  onClick={() => setEditingComm(comm)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                  title="Edit Committee"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {comm.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {comm.shortDescription}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold">Chairman: {comm.headName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{comm.meetingSchedule}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {comm.objectives.length} Target Objectives
              </span>
              <button
                onClick={() => setEditingComm(comm)}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                Modify Scope
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingComm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold">
                Edit Committee: {editingComm.name}
              </h3>
              <button
                onClick={() => setEditingComm(null)}
                className="p-1 text-emerald-200 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Committee Name</label>
                <input
                  type="text"
                  required
                  value={editingComm.name}
                  onChange={(e) =>
                    setEditingComm({ ...editingComm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingComm.shortDescription}
                  onChange={(e) =>
                    setEditingComm({
                      ...editingComm,
                      shortDescription: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Scope & Responsibilities</label>
                <textarea
                  rows={3}
                  required
                  value={editingComm.fullDescription}
                  onChange={(e) =>
                    setEditingComm({
                      ...editingComm,
                      fullDescription: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chairman / Head Name</label>
                  <input
                    type="text"
                    required
                    value={editingComm.headName}
                    onChange={(e) =>
                      setEditingComm({ ...editingComm, headName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meeting Schedule & Venue</label>
                  <input
                    type="text"
                    required
                    value={editingComm.meetingSchedule}
                    onChange={(e) =>
                      setEditingComm({
                        ...editingComm,
                        meetingSchedule: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingComm(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Committee</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
