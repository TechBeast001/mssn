import React, { useState, useEffect } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { Member } from '../../types';
import { DigitalIDCard } from '../idcard/DigitalIDCard';
import { DualLogo } from '../common/DualLogo';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  GraduationCap,
  IdCard
} from 'lucide-react';

interface VerifyMemberViewProps {
  initialQuery?: string;
  onOpenRegistration?: () => void;
}

export const VerifyMemberView: React.FC<VerifyMemberViewProps> = ({
  initialQuery = '',
  onOpenRegistration
}) => {
  const { members, getMemberByMatric, getMemberByMembershipId } = useMSSNStore();
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [matchedMember, setMatchedMember] = useState<Member | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [showFullIDCard, setShowFullIDCard] = useState<boolean>(false);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, members]);

  const performSearch = (query: string) => {
    const q = query.trim();
    if (!q) {
      setMatchedMember(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    // Match membershipId
    let found = getMemberByMembershipId(q);
    if (!found) {
      // Match matric
      found = getMemberByMatric(q);
    }
    if (!found) {
      const lower = q.toLowerCase();
      found = members.find(
        (m) =>
          m.membershipId.toLowerCase().includes(lower) ||
          m.matricNumber.toLowerCase().includes(lower) ||
          m.fullName.toLowerCase().includes(lower)
      );
    }

    setMatchedMember(found || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in bg-[#F8F9FA] text-slate-800">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] text-xs font-bold uppercase tracking-wider mb-1 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
          MSSN FUD Verification Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Member e-ID Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Verify registered student members of the Muslim Students' Society of Nigeria, Federal University Dutse Chapter in real-time.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center shadow-xs rounded-xl overflow-hidden border border-slate-300 bg-white focus-within:border-[#0F5132] focus-within:ring-2 focus-within:ring-[#0F5132]/10"
        >
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Membership ID (e.g. MSSNFUD/2024/0001) or Matric No..."
            className="w-full px-4 py-3.5 text-xs sm:text-sm text-slate-800 font-medium placeholder:text-slate-400 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold text-xs sm:text-sm tracking-wide shrink-0 transition-colors cursor-pointer"
          >
            Verify Now
          </button>
        </form>

        {/* Quick Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
          <span>Quick sample:</span>
          {members.slice(0, 3).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSearchQuery(m.membershipId);
                performSearch(m.membershipId);
              }}
              className="px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-[#0F5132] border border-slate-200 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
            >
              {m.membershipId}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result */}
      {hasSearched && (
        <div className="max-w-3xl mx-auto mb-10">
          {matchedMember ? (
            /* VERIFIED AUTHENTIC BADGE */
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              {/* Status Header */}
              <div className="bg-[#0F5132] p-5 text-white flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <DualLogo size="sm" showTogether={true} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900 uppercase tracking-wider">
                        Active & Verified Member
                      </span>
                      <span className="text-xs text-emerald-100 font-medium">
                        Valid: {matchedMember.session}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      Authenticity Confirmed
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">
                    Membership ID
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-white">
                    {matchedMember.membershipId}
                  </span>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Photo */}
                <div className="md:col-span-4 flex flex-col items-center text-center">
                  <div className="relative w-28 h-36 rounded-lg overflow-hidden border-2 border-[#0F5132] shadow-xs bg-slate-100">
                    <img
                      src={matchedMember.photoUrl}
                      alt={matchedMember.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-[#0F5132] text-white text-[9px] font-bold py-0.5 uppercase">
                      {matchedMember.level}
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F5132] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132]" />
                      Status: {matchedMember.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {matchedMember.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-[#0F5132]">
                      {matchedMember.matricNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Faculty</span>
                      <span className="font-bold text-slate-800 text-xs">{matchedMember.faculty}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Department</span>
                      <span className="font-bold text-slate-800 text-xs">{matchedMember.department}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Level & Session</span>
                      <span className="font-bold text-slate-800 text-xs">
                        {matchedMember.level} • {matchedMember.session}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                      <span className="text-[#0F5132] font-semibold block text-[10px] uppercase">Assigned Wing</span>
                      <span className="font-bold text-[#0F5132] text-xs">{matchedMember.committeePreference}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100">
                    <div>
                      <span>Security Hash: </span>
                      <span className="font-mono font-bold text-slate-800">
                        {matchedMember.securityHash || 'FUD-SEC-AUTH'}
                      </span>
                    </div>
                    <div>
                      <span>Registered: </span>
                      <span className="font-medium text-slate-700">
                        {new Date(matchedMember.registrationDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setShowFullIDCard(!showFullIDCard)}
                  className="px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <IdCard className="w-4 h-4" />
                  {showFullIDCard ? 'Hide Digital e-ID Badge' : 'View Full Digital e-ID Badge'}
                </button>

                <p className="text-xs text-slate-500">
                  Issued by: <strong>MSSN FUD Secretariat, Central Mosque</strong>
                </p>
              </div>

              {/* Collapsible Digital ID View */}
              {showFullIDCard && (
                <div className="p-6 bg-white border-t border-slate-200 animate-fade-in">
                  <DigitalIDCard member={matchedMember} />
                </div>
              )}
            </div>
          ) : (
            /* NOT FOUND ERROR STATE */
            <div className="bg-white rounded-xl p-8 shadow-xs border border-rose-200 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-600">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Record Not Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  No registered student member matches the query "<strong>{searchQuery}</strong>". Please check the Matric Number or Membership ID.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                {onOpenRegistration && (
                  <button
                    onClick={onOpenRegistration}
                    className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
                  >
                    <span>Register as Member</span>
                  </button>
                )}
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer border border-slate-200"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Instant QR Verification</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every digital e-ID badge contains a dynamic QR code pointing directly to this official verification registry.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Security Hash</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Each card carries a unique cryptographic session code preventing fraudulent duplication of student credentials.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Academic Benefits</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verified members access free faculty tutorials, study resources, emergency welfare grants, and Islamic programs.
          </p>
        </div>
      </div>
    </div>
  );
};
