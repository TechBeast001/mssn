import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { SocialLinks } from '../common/SocialLinks';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  ShieldCheck,
  MessageSquare,
  Share2
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { siteContent } = useMSSNStore();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [category, setCategory] = useState<string>('general');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <MapPin className="w-4 h-4 text-emerald-700" />
          Secretariat & Communications
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Connect with MSSN FUD
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Reach out for welfare support, academic tutorial scheduling, counseling, or general campus inquiries.
        </p>
      </div>

      {/* Main Grid: Form + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information & Office Hours */}
        <div className="lg:col-span-5 space-y-6">
          {/* Secretariat Details Box */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-800 shadow-xl relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block">
                Chapter Headquarters
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                MSSN FUD Secretariat
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                Central Mosque Complex, Permanent Site, Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-emerald-800 text-xs sm:text-sm text-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase block font-bold">Email Inquiries</span>
                  <a href={`mailto:${siteContent.contactEmail}`} className="font-semibold hover:underline">
                    {siteContent.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase block font-bold">Secretariat Hotline</span>
                  <span className="font-semibold">{siteContent.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase block font-bold">Office & Consultation Hours</span>
                  <span className="font-semibold">Monday – Sunday: Post Zuhr & Asr Prayers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confidential Advisory Circle */}
          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-800" />
              <h4 className="font-extrabold text-sm text-amber-900">
                Confidential Shura Counseling
              </h4>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Need personal spiritual guidance, emotional counseling, or emergency academic accommodation? Our male and female advisors handle all matters with utmost Islamic confidentiality.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
          {submitted ? (
            <div className="py-16 text-center space-y-4 animate-scale-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to the MSSN Federal University Dutse Chapter. The secretariat will respond shortly In Sha Allah.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill the form below and the responsible committee or executive will attend to you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatima Umar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. fatima@fud.edu.ng"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none bg-white focus:border-emerald-600"
                  >
                    <option value="general">General Inquiries</option>
                    <option value="tutorials">Academic & GST/MTH Tutorials</option>
                    <option value="welfare">Student Welfare & Emergency Aid</option>
                    <option value="sisters">Sisters' Wing Matters</option>
                    <option value="dawah">Da'wah & Programs</option>
                    <option value="id_card">Membership & e-ID Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message, inquiry, or counseling request here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Send Message to Secretariat</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Official Social Media Channels Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Share2 className="w-4 h-4" />
              <span>Official Media Handles</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Connect With MSSN FUD On Social Media
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Stay updated with real-time Da'wah clips, campus announcements, Halqah schedules, and sisters' seminars.
            </p>
          </div>
        </div>

        <SocialLinks variant="cards" />
      </div>
    </div>
  );
};
