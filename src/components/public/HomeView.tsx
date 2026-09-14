import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { PublicTab } from '../layout/Navbar';
import { HomeSlideshow } from './HomeSlideshow';
import { PrayerTimesWidget } from './PrayerTimesWidget';
import { DualLogo } from '../common/DualLogo';
import { SocialLinks } from '../common/SocialLinks';
import {
  ArrowRight,
  ShieldCheck,
  Heart,
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  GraduationCap,
  Sparkles,
  FileCheck,
  Share2,
  Images,
  Download,
  Copy,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenRegistration: (initialCommittee?: string) => void;
  onSelectEvent?: (eventId: string) => void;
  onSelectArticle?: (articleId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onTabChange,
  onOpenRegistration,
  onSelectEvent,
  onSelectArticle
}) => {
  const {
    currentSession,
    members,
    committees,
    events,
    articles,
    causes,
    executives,
    elibrary,
    siteContent
  } = useMSSNStore();

  const [copiedHadith, setCopiedHadith] = useState(false);
  const [quickVerifyQuery, setQuickVerifyQuery] = useState('');

  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);
  const urgentCause = causes.find((c) => c.urgency === 'urgent' && c.isActive) || causes[0];

  const currentAmir =
    executives.find(
      (e) =>
        (e.order === 1 || e.portfolio.toLowerCase().includes('amir (president)')) &&
        e.session === currentSession.name
    ) ||
    executives.find((e) => e.order === 1) || {
      name: 'Mal. Nasirudeen Albany',
      portfolio: 'Amir (President)',
      department: 'Clinical Sciences',
      level: '500L',
      photoUrl: '/amir.jpg'
    };

  // Popular high-yield courses for quick past question launcher
  const quickCourses = [
    { code: 'GST 111', title: 'Communication in English', level: '100L', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { code: 'MTH 101', title: 'Elementary Mathematics I', level: '100L', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { code: 'CSC 201', title: 'Computer Programming I', level: '200L', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { code: 'BIO 101', title: 'General Biology I', level: '100L', color: 'bg-teal-50 text-teal-800 border-teal-200' },
    { code: 'ACC 201', title: 'Principles of Accounting I', level: '200L', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { code: 'DOC-01', title: 'MSSN FUD Chapter Constitution', level: 'General', color: 'bg-rose-50 text-rose-800 border-rose-200' }
  ];

  const handleCopyHadith = () => {
    const text = `Hadith of the Day (MSSN FUD):\n\n"${siteContent.hadithOfTheDay?.arabic || 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ'}"\n\n"${siteContent.hadithOfTheDay?.translation || 'Whoever takes a path in pursuit of knowledge, Allah facilitates for him a path to Paradise.'}" — ${siteContent.hadithOfTheDay?.narratorOrSource || 'Sahih Muslim'}\n\nOfficial Website: https://mssnfud.org`;
    navigator.clipboard.writeText(text);
    setCopiedHadith(true);
    setTimeout(() => setCopiedHadith(false), 2500);
  };

  const handleQuickVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickVerifyQuery.trim()) {
      window.location.href = `?verify=${encodeURIComponent(quickVerifyQuery.trim())}`;
    } else {
      onTabChange('verify');
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in pb-20 bg-slate-50 text-slate-900">
      {/* 1. HERO SLIDESHOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <HomeSlideshow
          onTabChange={onTabChange}
          onOpenRegistration={() => onOpenRegistration()}
        />
      </section>

      {/* 2. REAL-TIME CAMPUS PRAYER TIMES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PrayerTimesWidget variant="banner" onExploreEvents={() => onTabChange('events')} />
      </section>

      {/* 3. CORE 4-PILLAR ACTION HUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Campus Services & Portals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Empowering Muslim Students at FUD
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Explore primary student services, free academic mentoring repositories, and campus spiritual circles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Membership Registration */}
          <div
            onClick={() => onOpenRegistration()}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-600 hover:shadow-md card-hover-elevate transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors flex items-center justify-center shadow-xs">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Digital Membership e-ID
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Instant registration for all FUD faculties with a downloadable, QR-verifiable official student digital e-ID card.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span className="group-hover:underline">Register Online</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2: Academic E-Library & Past Questions */}
          <div
            onClick={() => onTabChange('elibrary')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-600 hover:shadow-md card-hover-elevate transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors flex items-center justify-center shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Free Repository
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                  E-Library & Past Questions
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  100L-500L past exam papers, lecture handouts, and syllabus guides across Science, Computing, Arts, and Medicine.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span className="group-hover:underline">Access E-Library</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3: Da'wah & Halqahs */}
          <div
            onClick={() => onTabChange('events')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-600 hover:shadow-md card-hover-elevate transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors flex items-center justify-center shadow-xs">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Halqahs & Usrah Circles
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Weekly Thursday & Sunday Islamic lectures, Tajweed circles, and Sisters' forum at the FUD Central Mosque.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span className="group-hover:underline">View Programs</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 4: Welfare & Sadaqah Relief */}
          <div
            onClick={() => onTabChange('donations')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-600 hover:shadow-md card-hover-elevate transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors flex items-center justify-center shadow-xs">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Student Welfare Fund
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Emergency tuition assistance, hostel relief, and healthcare aid for indigent Muslim students on campus.
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span className="group-hover:underline">Support Indigent Aid</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. HIGH-YIELD PAST QUESTIONS QUICK LAUNCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Repository</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Frequently Accessed Past Questions & Materials
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Download verified past exams and lecture summaries curated by the MSSN FUD Academic Directorate.
              </p>
            </div>

            <button
              onClick={() => onTabChange('elibrary')}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Explore All {elibrary.length} Files</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {quickCourses.map((c) => (
              <div
                key={c.code}
                onClick={() => onTabChange('elibrary')}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-600 bg-slate-50/70 hover:bg-white transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 rounded-xl bg-emerald-800 text-amber-300 font-mono font-black text-xs shadow-2xs">
                    {c.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {c.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Level: {c.level}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-800 group-hover:border-emerald-400 transition-colors shrink-0">
                  <Download className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE STATS & QUICK VERIFY SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Key Metrics */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                {currentSession.name} Academic Session
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Official Campus Community Statistics
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                  {members.length > 30 ? `${members.length}+` : '3,450+'}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  Registered Members
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                  {committees.length}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  Active Committees
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                  {events.length}+
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  Annual Programs
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                  6 Faculties
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  Full Coverage
                </div>
              </div>
            </div>
          </div>

          {/* Quick ID Verification Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#06331E] to-[#042013] text-white rounded-3xl p-6 sm:p-8 border border-emerald-900 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Instant Member Verification</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Verify Student Membership
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Confirm active student status, committee portfolio, and official digital e-ID card validity.
              </p>
            </div>

            <form onSubmit={handleQuickVerifySubmit} className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickVerifyQuery}
                  onChange={(e) => setQuickVerifyQuery(e.target.value)}
                  placeholder="Enter Matric No (e.g. FUD/22/SCI/042)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-emerald-200/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors cursor-pointer text-center"
                >
                  Verify Member Now
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange('verify')}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
                >
                  Scan QR
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 6. PRESIDENT'S WELCOME ADDRESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-44 h-52 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md bg-slate-100">
              <img
                src={currentAmir.photoUrl || '/amir.jpg'}
                alt={currentAmir.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-emerald-800 text-white text-[9px] font-bold py-1 uppercase tracking-wider">
                {currentAmir.level} {currentAmir.department}
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <h4 className="font-black text-slate-900 text-base">
                {currentAmir.name}
              </h4>
              <p className="text-xs font-bold text-emerald-800">
                {currentAmir.portfolio}, MSSN FUD Chapter
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {currentSession.name} Executive Cabinet
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
              <DualLogo size="sm" showTogether={true} />
              <span className="font-bold">Presidential Address</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              Assalamu Alaikum wa Rahmatullahi wa Barakatuh
            </h2>

            <blockquote className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-4 border-emerald-800 pl-4 py-1.5 bg-slate-50/60 rounded-r-xl">
              "We warmly welcome every Muslim student at Federal University Dutse to a home of academic excellence, spiritual tarbiyyah, and authentic brotherhood. Through MSSN FUD, our goal is to graduate well-rounded scholars and upright leaders of the community."
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-slate-900 text-xs">Spiritual Development</h5>
                  <p className="text-[11px] text-slate-600 mt-0.5">Weekly Usrah, Tajweed, and Halqahs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-slate-900 text-xs">Academic Mentoring</h5>
                  <p className="text-[11px] text-slate-600 mt-0.5">Free tutorial sessions across all 6 faculties.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onTabChange('about')}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Read Chapter History</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => onTabChange('leadership')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Executive Council Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              Campus Programs
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Upcoming Events & Halqahs
            </h2>
          </div>

          <button
            onClick={() => onTabChange('events')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => {
            const photoCount = event.images && event.images.length > 0 ? event.images.length : (event.flyerUrl ? 1 : 0);
            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md card-hover-elevate transition-all flex flex-col justify-between group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={event.flyerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-800/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {event.category}
                  </div>
                  {photoCount > 1 && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-xs">
                      <Images className="w-3.5 h-3.5 text-amber-300" />
                      <span>{photoCount} Photos</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(event.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} • {event.time}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-slate-900 line-clamp-2 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {event.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate max-w-[170px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{event.venue}</span>
                    </span>

                    <button
                      onClick={() => {
                        if (onSelectEvent) onSelectEvent(event.id);
                        else onTabChange('events');
                      }}
                      className="text-xs font-extrabold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. SADAQAH WELFARE APPEAL & HADITH INSPIRATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Urgent Cause Card */}
          {urgentCause && (
            <div className="lg:col-span-7 bg-gradient-to-br from-emerald-900 to-[#06331E] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800 flex flex-col justify-between space-y-6">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
                    Welfare Appeal
                  </span>
                  <span className="text-xs text-emerald-200 font-semibold font-mono">
                    {urgentCause.bankName}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {urgentCause.title}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  {urgentCause.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-amber-300">
                      Raised: ₦{urgentCause.raisedAmount.toLocaleString()}
                    </span>
                    <span className="text-emerald-200">
                      Target: ₦{urgentCause.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((urgentCause.raisedAmount / urgentCause.targetAmount) * 100)
                        )}%`
                      }}
                    />
                  </div>
                </div>

                {/* Bank Account */}
                <div className="p-4 rounded-2xl bg-black/25 border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase block font-bold font-mono">
                      Account Number ({urgentCause.bankName})
                    </span>
                    <span className="text-base font-mono font-black text-amber-300 tracking-wider">
                      {urgentCause.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase block font-bold font-mono">
                      Account Name
                    </span>
                    <span className="font-bold text-white text-xs">
                      {urgentCause.accountName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-700/60 flex items-center justify-between">
                <button
                  onClick={() => onTabChange('donations')}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-slate-950" />
                  <span>Donate / Submit Receipt</span>
                </button>

                <p className="text-xs text-emerald-200 italic hidden sm:block">
                  "Charity does not decrease wealth." — Sahih Muslim
                </p>
              </div>
            </div>
          )}

          {/* Hadith / Ayah Inspiration Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Hadith of the Day</span>
                </div>

                <button
                  onClick={handleCopyHadith}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  {copiedHadith ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHadith ? 'Copied' : 'Share'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-3">
                <p className="font-arabic text-right text-emerald-900 text-lg sm:text-xl font-bold leading-loose">
                  {siteContent.hadithOfTheDay?.arabic || 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ'}
                </p>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed italic">
                  "{siteContent.hadithOfTheDay?.translation || 'Whoever treads a path in pursuit of knowledge, Allah will facilitate for him a path to Paradise.'}"
                </p>
                <p className="text-[11px] text-slate-500 font-bold text-right font-mono">
                  — {siteContent.hadithOfTheDay?.narratorOrSource || 'Sahih Muslim (2699)'}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Campus Guidance & Halqah
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Confidential academic and spiritual counseling is available at the Secretariat adjacent Central Mosque.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => onTabChange('blog')}
                className="text-xs font-black text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Read Articles & Publications</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. OFFICIAL SOCIAL MEDIA CHANNELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1.5">
                <Share2 className="w-4 h-4" />
                <span>Stay Connected with the Ummah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Follow MSSN FUD Official Channels
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Join thousands of Muslim students across Federal University Dutse on our verified TikTok, Facebook, X (Twitter), and WhatsApp communities.
              </p>
            </div>

            <button
              onClick={() => onTabChange('contact')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-2"
            >
              <span>Contact Secretariat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <SocialLinks variant="cards" />
        </div>
      </section>
    </div>
  );
};
