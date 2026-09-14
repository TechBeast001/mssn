import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { DonationCause } from '../../types';
import {
  Heart,
  Copy,
  Check,
  CheckCircle2,
  X,
  HandCoins
} from 'lucide-react';

export const DonationsView: React.FC = () => {
  const { causes, addDonation } = useMSSNStore();
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [selectedCauseForDonation, setSelectedCauseForDonation] = useState<DonationCause | null>(null);

  // Form state
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [amount, setAmount] = useState<string>('5000');
  const [reference, setReference] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleCopy = (accountNumber: string, causeId: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedBankId(causeId);
    setTimeout(() => {
      setCopiedBankId(null);
    }, 2500);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCauseForDonation) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    addDonation({
      causeId: selectedCauseForDonation.id,
      causeTitle: selectedCauseForDonation.title,
      donorName: isAnonymous ? 'Anonymous Servant of Allah' : (donorName.trim() || 'Anonymous Servant of Allah'),
      donorEmail: donorEmail.trim() || undefined,
      amount: parsedAmount,
      paymentMethod: 'Bank Transfer',
      referenceNumber: reference.trim() || `TRF-${Date.now().toString().slice(-6)}`,
      notes: donorMessage.trim() || undefined
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setSelectedCauseForDonation(null);
      setDonorName('');
      setDonorEmail('');
      setReference('');
      setDonorMessage('');
    }, 2500);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in bg-[#F8F9FA] text-slate-800">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-wider border border-rose-200">
          <Heart className="w-4 h-4 text-rose-600" />
          Sadaqah & Student Welfare
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Invest in the Hereafter
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Support indigent students' tuition fees, campus Ramadan Iftar feeding, free tutorial materials, and Da'wah equipment at Federal University Dutse.
        </p>

        <div className="max-w-xl mx-auto p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700 space-y-1">
          <p className="font-arabic text-sm font-semibold text-[#0F5132]">
            مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ
          </p>
          <p className="italic text-slate-600 text-[11px]">
            "The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes; in each spike is a hundred grains." (Surah Al-Baqarah 2:261)
          </p>
        </div>
      </div>

      {/* Causes List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {causes.map((cause) => {
          const raised = typeof cause.raisedAmount === 'number' ? cause.raisedAmount : 0;
          const target = typeof cause.targetAmount === 'number' && cause.targetAmount > 0 ? cause.targetAmount : 1;
          const percent = Math.min(100, Math.round((raised / target) * 100));
          const categoryDisplay = (cause.category || 'welfare').toUpperCase();
          const isUrgent = cause.urgency === 'urgent';

          return (
            <div
              key={cause.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:border-[#0F5132] hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Status Badges */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isUrgent
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-[#0F5132] border border-emerald-200'
                    }`}
                  >
                    {isUrgent ? 'Urgent Appeal' : 'Ongoing Sadaqah'}
                  </span>

                  <span className="text-[11px] font-semibold text-slate-500 font-mono">
                    {categoryDisplay}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {cause.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {cause.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#0F5132]">
                      ₦{raised.toLocaleString()} Raised
                    </span>
                    <span className="text-slate-500">
                      Target: ₦{target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-[#0F5132] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 block text-right">
                    {percent}% achieved
                  </span>
                </div>

                {/* Bank Account Details Card with Copy Button */}
                <div className="p-3.5 rounded-lg bg-[#0F5132] text-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
                      {cause.bankName || 'Official Bank'}
                    </span>
                    <button
                      onClick={() => handleCopy(cause.accountNumber || '', cause.id)}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedBankId === cause.id ? (
                        <>
                          <Check className="w-3 h-3 text-amber-300" />
                          <span className="text-[10px] text-amber-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <span className="text-base font-mono font-bold text-amber-300 tracking-wider block">
                      {cause.accountNumber}
                    </span>
                    <span className="text-xs text-emerald-100 block truncate">
                      {cause.accountName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => setSelectedCauseForDonation(cause)}
                  className="w-full py-2.5 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold rounded-lg text-xs shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <HandCoins className="w-4 h-4 text-amber-300" />
                  <span>Log Donation Receipt</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Notification Modal */}
      {selectedCauseForDonation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="bg-[#0F5132] text-white p-5 relative">
              <button
                onClick={() => setSelectedCauseForDonation(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                Sadaqah Receipt
              </span>
              <h3 className="text-base font-bold text-white">
                Log Donation: {selectedCauseForDonation.title}
              </h3>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-[#0F5132]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Jazakumullahu Khayran!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  May Allah accept your noble contribution and multiply your reward. The financial secretariat has recorded your receipt.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonationSubmit} className="p-5 space-y-3.5">
                {/* Bank details reminder */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px]">Transfer To:</span>
                    <span className="font-mono font-bold text-[#0F5132]">
                      {selectedCauseForDonation.accountNumber} ({selectedCauseForDonation.bankName})
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedCauseForDonation.accountName}
                  </span>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount Donated (₦ NGN) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-xs sm:text-sm text-slate-900 outline-none focus:border-[#0F5132]"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[1000, 2000, 5000, 10000, 25000].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setAmount(preset.toString())}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-bold"
                      >
                        ₦{preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anonymous checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#0F5132] rounded border-slate-300"
                  />
                  <label htmlFor="anon" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Keep my identity Anonymous (Hidden from public records)
                  </label>
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Brother Abdullahi Sani"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#0F5132]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transfer Reference / Bank Narration
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. Session 2025 Sadaqah - FirstBank"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dua / Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    placeholder="May Allah accept it and grant our students success."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 outline-none focus:border-[#0F5132]"
                  ></textarea>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCauseForDonation(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                  >
                    Submit Confirmation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
