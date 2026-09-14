import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { FUD_FACULTIES } from '../../data/mockDatabase';
import { Member } from '../../types';
import { DigitalIDCard } from '../idcard/DigitalIDCard';
import { DualLogo } from '../common/DualLogo';
import { readFileAsOptimizedDataUrl } from '../../utils/imageUtils';
import {
  X,
  Upload,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lock
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommittee?: string;
  preselectedCommittee?: string;
  onVerifyClick?: (membershipId: string) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80'
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialCommittee,
  preselectedCommittee,
  onVerifyClick
}) => {
  const effectiveInitialCommittee = preselectedCommittee || initialCommittee;
  const {
    committees,
    currentSession,
    registerMember,
    checkDuplicate,
    siteContent
  } = useMSSNStore();

  const isRegistrationClosed = siteContent?.isRegistrationOpen === false;

  const [formData, setFormData] = useState({
    fullName: '',
    matricNumber: '',
    faculty: FUD_FACULTIES[0].name,
    department: FUD_FACULTIES[0].departments[0],
    level: '100L',
    phone: '',
    email: '',
    stateOfOrigin: 'Jigawa',
    committeePreference: effectiveInitialCommittee || committees[0]?.name || "Da'wah & Tarbiyyah Committee",
    secondaryCommittee: '',
    photoUrl: SAMPLE_AVATARS[0]
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [duplicateMember, setDuplicateMember] = useState<Member | null>(null);
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFacultyObj = FUD_FACULTIES.find((f) => f.name === formData.faculty) || FUD_FACULTIES[0];

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const facName = e.target.value;
    const fac = FUD_FACULTIES.find((f) => f.name === facName) || FUD_FACULTIES[0];
    setFormData({
      ...formData,
      faculty: facName,
      department: fac.departments[0]
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await readFileAsOptimizedDataUrl(file, 400, 400, 0.75);
        if (optimized) {
          setFormData((prev) => ({ ...prev, photoUrl: optimized }));
          setErrorMsg(null);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to process photo.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setDuplicateMember(null);

    // Validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      setErrorMsg('Please enter your full name as registered with the University.');
      return;
    }
    if (!formData.matricNumber.trim()) {
      setErrorMsg('Please provide your valid FUD Matriculation Number (e.g. FUD/22/SCI/042).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 9) {
      setErrorMsg('Please enter a valid active phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check duplicate
      const dupCheck = checkDuplicate(formData.matricNumber, formData.email);
      if (dupCheck.isDuplicate) {
        setErrorMsg(dupCheck.reason || 'You are already registered.');
        if (dupCheck.existingMember) {
          setDuplicateMember(dupCheck.existingMember);
        }
        setIsSubmitting(false);
        return;
      }

      // Register new member
      const result = registerMember({
        ...formData,
        session: currentSession.name
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setRegisteredMember(result.member);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setRegisteredMember(null);
    setDuplicateMember(null);
    setErrorMsg(null);
    setFormData({
      fullName: '',
      matricNumber: '',
      faculty: FUD_FACULTIES[0].name,
      department: FUD_FACULTIES[0].departments[0],
      level: '100L',
      phone: '',
      email: '',
      stateOfOrigin: 'Jigawa',
      committeePreference: committees[0]?.name || "Da'wah & Tarbiyyah Committee",
      secondaryCommittee: '',
      photoUrl: SAMPLE_AVATARS[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${registeredMember || duplicateMember ? 'max-w-4xl' : 'max-w-2xl'} overflow-hidden animate-scale-up transition-all duration-300`}>
        {/* Modal Header */}
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
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Register as a New Member
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-400 text-slate-900">
                  {currentSession.name}
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-0.5">
                Muslim Students' Society of Nigeria • Federal University Dutse Chapter
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {registeredMember ? (
            /* SUCCESS VIEW */
            <div className="space-y-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-[#0F5132] shadow-xs mb-1 border border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Registration Successful
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  Welcome to MSSN FUD, <strong>{registeredMember.fullName}</strong>. Your official digital student e-ID badge is generated below.
                </p>
              </div>

              <div className="py-2">
                <DigitalIDCard
                  member={registeredMember}
                  onVerifyClick={(id) => {
                    onClose();
                    if (onVerifyClick) onVerifyClick(id);
                  }}
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
                >
                  Done / Close
                </button>
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors text-xs cursor-pointer"
                >
                  Register Another Student
                </button>
              </div>
            </div>
          ) : duplicateMember ? (
            /* DUPLICATE MEMBER VIEW */
            <div className="space-y-5 text-center py-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 shadow-xs border border-amber-200">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Already Registered
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
                  A member record with Matric <strong>{duplicateMember.matricNumber}</strong> or Email <strong>{duplicateMember.email}</strong> is already enrolled as <strong>{duplicateMember.fullName}</strong> ({duplicateMember.membershipId}).
                </p>
              </div>

              <div className="py-2">
                <DigitalIDCard
                  member={duplicateMember}
                  onVerifyClick={(id) => {
                    onClose();
                    if (onVerifyClick) onVerifyClick(id);
                  }}
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-semibold rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors text-xs cursor-pointer"
                >
                  Back to Form
                </button>
              </div>
            </div>
          ) : isRegistrationClosed ? (
            /* REGISTRATION CLOSED VIEW */
            <div className="space-y-6 text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="px-3 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
                  REGISTRATION CLOSED
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Membership Portal is Currently Closed
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {siteContent?.registrationNotice ||
                    `Online membership registration for the ${currentSession.name} Academic Session is currently closed by the administration.`}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-lg mx-auto text-left space-y-2">
                <p className="text-xs font-bold text-slate-800">
                  Need Assistance or Late Registration Inquiries?
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please visit the <strong>MSSN Secretariat</strong> adjacent to the FUD Central Mosque or contact the executive hotlines:
                </p>
                <div className="pt-1 text-xs text-emerald-800 font-mono font-semibold">
                  📞 {siteContent?.contactPhone || '+234 803 123 4567'} | ✉️ {siteContent?.contactEmail || 'info@mssnfud.org'}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close Window
                </button>
                {onVerifyClick && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onVerifyClick('');
                    }}
                    className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl border border-emerald-200 text-xs transition-colors cursor-pointer"
                  >
                    Verify Existing ID Card
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Notice Banner */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Instant e-ID Generation:</strong> Fill in your academic details to receive your official MSSN FUD membership identifier (e.g. <span className="font-mono font-bold text-[#0F5132]">MSSNFUD/{currentSession.endYear}/...</span>) and verifiable digital identity badge.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Photo Upload */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Passport Photograph *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden border-2 border-[#0F5132] shadow-xs bg-slate-200 shrink-0">
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D26] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-amber-300" />
                        Upload Custom Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">
                        Or select a sample student photo:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_AVATARS.map((url, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setFormData({ ...formData, photoUrl: url })}
                            className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              formData.photoUrl === url
                                ? 'border-[#0F5132] ring-2 ring-amber-400 scale-105'
                                : 'border-slate-300 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name (As registered in FUD) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim Muhammad Danjuma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-medium outline-none bg-white text-slate-900"
                  />
                </div>

                {/* Matric Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    FUD Matric Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FUD/22/SCI/042"
                    value={formData.matricNumber}
                    onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-mono font-medium outline-none uppercase bg-white text-slate-900"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-medium outline-none bg-white text-slate-900"
                  >
                    <option value="100L">100 Level</option>
                    <option value="200L">200 Level</option>
                    <option value="300L">300 Level</option>
                    <option value="400L">400 Level</option>
                    <option value="500L">500 Level</option>
                    <option value="Postgraduate">Postgraduate / Masters</option>
                  </select>
                </div>

                {/* Faculty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Faculty *
                  </label>
                  <select
                    value={formData.faculty}
                    onChange={handleFacultyChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-medium outline-none bg-white text-slate-900"
                  >
                    {FUD_FACULTIES.map((fac) => (
                      <option key={fac.name} value={fac.name}>
                        {fac.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-medium outline-none bg-white text-slate-900"
                  >
                    {currentFacultyObj.departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ibrahim@fud.edu.ng"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-medium outline-none bg-white text-slate-900"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-medium outline-none bg-white text-slate-900"
                  />
                </div>

                {/* State of Origin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State of Origin
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jigawa, Kano, Kaduna"
                    value={formData.stateOfOrigin}
                    onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-medium outline-none bg-white text-slate-900"
                  />
                </div>

                {/* Committee Preference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Committee Wing Preference *
                  </label>
                  <select
                    value={formData.committeePreference}
                    onChange={(e) => setFormData({ ...formData, committeePreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-300 focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] text-xs sm:text-sm font-semibold text-[#0F5132] outline-none bg-emerald-50/50"
                  >
                    {committees.map((comm) => (
                      <option key={comm.id} value={comm.name}>
                        {comm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Submission Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500 text-center sm:text-left">
                  By registering, you confirm you are a bona fide student of Federal University Dutse.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 sm:w-auto px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D26] text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Generating ID...'
                    ) : (
                      <>
                        <span>Submit Registration</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
