import React from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { PublicTab } from '../layout/Navbar';
import {
  BookOpen,
  Target,
  Compass,
  Heart,
  Shield,
  GraduationCap,
  Users,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenRegistration: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onTabChange,
  onOpenRegistration
}) => {
  const { siteContent, currentSession } = useMSSNStore();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16 animate-fade-in">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <Compass className="w-4 h-4 text-emerald-700" />
          About Our Chapter
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          History, Vision & Heritage
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The Muslim Students' Society of Nigeria (MSSN), Federal University Dutse Chapter — An enduring citadel of faith, moral tarbiyyah, and academic distinction in Jigawa State.
        </p>
      </div>

      {/* 2. Founding Story & History */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            Founding Journey
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Inception at Federal University Dutse
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {siteContent.aboutHistory}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onTabChange('leadership')}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore Executive Archives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-700 aspect-video">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
              alt="FUD Central Mosque Congregation"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 inset-x-0 bg-emerald-950/90 text-white text-[10px] font-bold p-2 text-center">
              MSSN FUD General Assembly & Usrah Circle
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <h4 className="font-bold text-emerald-950">University Affiliation</h4>
            <p>
              Registered officially under the Student Affairs Division, Federal University Dutse, PMB 7156, Dutse, Jigawa State.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl border border-emerald-700 relative overflow-hidden space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Our Vision</h3>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            {siteContent.vision}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">Our Mission</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {siteContent.mission}
          </p>
        </div>
      </div>

      {/* 4. Five Core Pillars / Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Core Pillars & Values
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            The foundational principles that guide every lecture, tutorial, and outreach program at FUD.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteContent.coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
                0{idx + 1}
              </div>
              <h4 className="font-extrabold text-base text-slate-900">
                {val.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MSSN Anthem & Motto Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-arabic text-2xl sm:text-3xl text-amber-400 font-bold">
            وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا
          </p>
          <p className="text-xs sm:text-sm text-emerald-200 italic">
            "And hold firmly to the rope of Allah all together and do not become divided" — Surah Ali 'Imran (3:103)
          </p>
        </div>

        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
          <h4 className="font-bold text-amber-300 uppercase tracking-widest text-[11px]">
            The MSSN Motto
          </h4>
          <p className="font-medium text-white text-sm">
            "Hope of the Ummah, Pride of the Nation."
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onOpenRegistration}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Join MSSN FUD Today</span>
          </button>
        </div>
      </div>
    </div>
  );
};
