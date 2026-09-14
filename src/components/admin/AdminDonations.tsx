import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { DonationCause, DonationRecord } from '../../types';
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  Building,
  Coins,
  ShieldCheck
} from 'lucide-react';

export const AdminDonations: React.FC = () => {
  const { causes, donations, addDonation, updateDonationCause } = useMSSNStore();
  const [showAddCauseModal, setShowAddCauseModal] = useState<boolean>(false);
  const [editingCause, setEditingCause] = useState<DonationCause | null>(null);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('500000');
  const [category, setCategory] = useState<'welfare' | 'dawah' | 'infrastructure' | 'jihad_week'>('welfare');
  const [bankName, setBankName] = useState<string>('Jaiz Bank Plc');
  const [accountNumber, setAccountNumber] = useState<string>('0012345678');
  const [accountName, setAccountName] = useState<string>('MSSN Federal University Dutse');
  const [urgency, setUrgency] = useState<'normal' | 'high' | 'urgent'>('normal');

  const totalRaised = donations.reduce((acc, d) => acc + d.amount, 0);

  const handleOpenEdit = (c: DonationCause) => {
    setEditingCause(c);
    setTitle(c.title);
    setDescription(c.description);
    setTargetAmount(c.targetAmount.toString());
    setCategory(c.category || 'welfare');
    setBankName(c.bankName);
    setAccountNumber(c.accountNumber);
    setAccountName(c.accountName);
    setUrgency(c.urgency || 'normal');
    setShowAddCauseModal(true);
  };

  const handleSaveCause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCause) {
      updateDonationCause(editingCause.id, {
        title: title.trim(),
        description: description.trim(),
        targetAmount: parseFloat(targetAmount) || 100000,
        category,
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
        urgency
      });
    }

    setShowAddCauseModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <Heart className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Sadaqah & Welfare Fund Accounting
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total Verified Inflow: <strong className="text-emerald-800 font-mono text-sm">₦{totalRaised.toLocaleString()}</strong> across {causes.length} appeals.
          </p>
        </div>
      </div>

      {/* Causes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {causes.map((cause) => {
          const percent = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));
          return (
            <div
              key={cause.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      cause.urgency === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {cause.urgency}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(cause)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {cause.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {cause.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-800">
                      ₦{cause.raisedAmount.toLocaleString()}
                    </span>
                    <span className="text-slate-500">
                      ₦{cause.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-0.5 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Assigned Bank
                  </span>
                  <p className="font-mono font-bold text-slate-900">{cause.accountNumber}</p>
                  <p className="text-[11px] text-slate-500">{cause.bankName}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                <span>Category: {cause.category}</span>
                <span className="font-bold text-emerald-800">{percent}% funded</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">
            Recent Sadaqah Inflows & Records
          </h3>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {donations.length} records logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Cause</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((d) => {
                const cause = causes.find((c) => c.id === d.causeId);
                return (
                  <tr key={d.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {d.donorName}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-emerald-800">
                      ₦{d.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">
                      {cause?.title || 'General Student Welfare'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {d.reference || 'DIRECT'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Cause Modal */}
      {showAddCauseModal && editingCause && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold">Edit Welfare Cause</h3>
              <button
                onClick={() => setShowAddCauseModal(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCause} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cause Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as 'normal' | 'urgent')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white font-bold"
                >
                  <option value="normal">Normal Ongoing</option>
                  <option value="urgent">Urgent Appeal</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddCauseModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md"
                >
                  Save Cause
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
