import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { Member } from '../../types';
import { DigitalIDCard } from '../idcard/DigitalIDCard';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  IdCard,
  X,
  CheckCircle2,
  Save,
  ShieldCheck,
  Building,
  GraduationCap,
  Upload
} from 'lucide-react';

interface AdminMembersProps {
  onOpenAddMember: () => void;
}

export const AdminMembers: React.FC<AdminMembersProps> = ({ onOpenAddMember }) => {
  const {
    members,
    sessions,
    committees,
    faculties,
    currentSession,
    updateMember,
    deleteMember,
    exportMembersCSV
  } = useMSSNStore();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [viewingIDMember, setViewingIDMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (selectedSession !== 'all' && m.session !== selectedSession) return false;
    if (selectedFaculty !== 'all' && m.faculty !== selectedFaculty) return false;
    if (selectedLevel !== 'all' && m.level !== selectedLevel) return false;
    if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchMatric = m.matricNumber.toLowerCase().includes(q);
      const matchId = m.membershipId.toLowerCase().includes(q);
      const matchDept = m.department.toLowerCase().includes(q);
      if (!matchName && !matchMatric && !matchId && !matchDept) return false;
    }
    return true;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    updateMember(editingMember.id, editingMember);
    setEditingMember(null);
  };

  const handleDelete = (member: Member) => {
    setMemberToDelete(member);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete.id);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Main Actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Membership Directory & e-ID Registry
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Managing {members.length} registered student records across all academic sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddMember}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Add New Member</span>
          </button>

          <button
            onClick={exportMembersCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export CSV Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Matric No, or ID..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Session */}
          <div>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none bg-white focus:border-emerald-600"
            >
              <option value="all">All Sessions</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty */}
          <div>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none bg-white focus:border-emerald-600"
            >
              <option value="all">All Faculties</option>
              {faculties.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none bg-white focus:border-emerald-600"
            >
              <option value="all">All Levels</option>
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filteredMembers.length}</strong> of {members.length} student records
          </span>
          {(searchQuery || selectedSession !== 'all' || selectedFaculty !== 'all' || selectedLevel !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSession('all');
                setSelectedFaculty('all');
                setSelectedLevel('all');
                setSelectedStatus('all');
              }}
              className="text-emerald-800 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Member / Photo</th>
                <th className="py-3.5 px-4">Membership ID</th>
                <th className="py-3.5 px-4">Matric No</th>
                <th className="py-3.5 px-4">Department & Level</th>
                <th className="py-3.5 px-4">Committee</th>
                <th className="py-3.5 px-4">Session</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Photo & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photoUrl}
                        alt={member.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-emerald-600 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 block text-xs">
                          {member.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[140px]">
                          {member.email || member.phoneNumber || 'No contact phone'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {member.membershipId}
                  </td>

                  {/* Matric */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {member.matricNumber}
                  </td>

                  {/* Dept */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">
                      {member.department}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {member.faculty} • {member.level}
                    </span>
                  </td>

                  {/* Committee */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-bold text-[11px] border border-emerald-200">
                      {member.committeePreference}
                    </span>
                  </td>

                  {/* Session */}
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {member.session}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        member.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : member.status === 'alumni'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewingIDMember(member)}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                        title="View & Print Digital e-ID Card"
                      >
                        <IdCard className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Edit Member Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(member)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-900 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="font-bold text-slate-700">No member records match the filter.</p>
          </div>
        )}
      </div>

      {/* View Digital ID Card Modal */}
      {viewingIDMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <IdCard className="w-4 h-4 text-amber-300" />
                <span>e-ID Card Preview: {viewingIDMember.membershipId}</span>
              </h3>
              <button
                onClick={() => setViewingIDMember(null)}
                className="p-1 text-emerald-200 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-100">
              <DigitalIDCard
                member={viewingIDMember}
                onClose={() => setViewingIDMember(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold">
                Edit Member: {editingMember.fullName}
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 text-emerald-200 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingMember.fullName}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matric Number</label>
                  <input
                    type="text"
                    required
                    value={editingMember.matricNumber}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, matricNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingMember.phoneNumber || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty</label>
                  <input
                    type="text"
                    value={editingMember.faculty}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, faculty: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingMember.department}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level</label>
                  <select
                    value={editingMember.level}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, level: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white"
                  >
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Committee</label>
                  <select
                    value={editingMember.committeePreference}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        committeePreference: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white font-medium"
                  >
                    {committees.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Member Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        status: e.target.value as 'active' | 'alumni' | 'suspended'
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white font-bold"
                  >
                    <option value="active">Active Member</option>
                    <option value="alumni">Alumni Member</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Member Passport Photo</label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingMember.photoUrl}
                    alt="Preview"
                    className="w-12 h-14 rounded-xl object-cover border border-slate-300 shadow-xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer border border-slate-200 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Upload from PC / Phone</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Photo size exceeds 5MB limit.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.result) {
                                setEditingMember({ ...editingMember, photoUrl: reader.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste photo URL..."
                      value={editingMember.photoUrl.startsWith('data:') ? '' : editingMember.photoUrl}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, photoUrl: e.target.value })
                      }
                      className="w-full px-3 py-1 rounded-xl border border-slate-300 outline-none font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Member Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Delete Member Record?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to permanently delete this student record?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={memberToDelete.photoUrl}
                alt={memberToDelete.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-extrabold text-slate-900 truncate">
                  {memberToDelete.fullName}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {memberToDelete.matricNumber} • {memberToDelete.membershipId}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
