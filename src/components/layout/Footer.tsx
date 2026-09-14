import React from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { PublicTab } from './Navbar';
import { HeaderBrand } from '../common/HeaderBrand';
import { SocialLinks } from '../common/SocialLinks';
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  ShieldCheck,
  Lock,
  ArrowUp,
  UserPlus,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Share2
} from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenRegistration: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onTabChange,
  onOpenRegistration,
  onOpenAdmin
}) => {
  const { siteContent, currentSession, events } = useMSSNStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextEvent = events.find((e) => e.status === 'upcoming') || events[0];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      {/* Top Footer Highlights Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            {nextEvent ? (
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    Upcoming Program
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 truncate">
                    {new Date(nextEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white truncate">
                  {nextEvent.title}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs text-slate-400">MSSN Federal University Dutse Chapter</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400">Academic Session:</span>
              <strong className="text-emerald-400 font-semibold">{currentSession.name}</strong>
            </div>

            <button
              onClick={onOpenRegistration}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register as a New Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Chapter Info */}
          <div className="space-y-4 lg:pr-4">
            <HeaderBrand size="md" variant="light" />

            <p className="text-xs text-slate-400 leading-relaxed">
              The Muslim Students' Society of Nigeria (MSSN), Federal University Dutse Chapter, nurtures spiritual consciousness, moral character, and academic distinction across campus.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <p className="font-arabic text-emerald-300 text-sm font-semibold text-right leading-relaxed" dir="rtl">
                وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا
              </p>
              <p className="text-[11px] text-slate-400 italic leading-snug">
                "And hold firmly to the rope of Allah all together and do not become divided." <span className="text-slate-500">(Surah Ali 'Imran 3:103)</span>
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Social Media
              </span>
              <SocialLinks variant="footer" />
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Home Page', tab: 'home' as PublicTab },
                { label: 'About Chapter & History', tab: 'about' as PublicTab },
                { label: 'Executive Council', tab: 'leadership' as PublicTab },
                { label: 'Working Committees', tab: 'committees' as PublicTab },
                { label: 'Programs & Events', tab: 'events' as PublicTab },
                { label: 'Photo & Media Gallery', tab: 'gallery' as PublicTab },
              ].map((item) => (
                <li key={item.tab}>
                  <button
                    onClick={() => onTabChange(item.tab)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Student & Member Services */}
          <div className="space-y-3.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Student Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenRegistration}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 text-left transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                    <UserPlus className="w-3 h-3" />
                  </div>
                  <span>Register as a New Member</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('verify')}
                  className="text-slate-400 hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer group"
                >
                  <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span>Verify Digital ID Card</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('donations')}
                  className="text-slate-400 hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer group"
                >
                  <div className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
                    <Heart className="w-3 h-3" />
                  </div>
                  <span>Sadaqah & Welfare Fund</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('blog')}
                  className="text-slate-400 hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer group"
                >
                  <div className="p-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                    <BookOpen className="w-3 h-3" />
                  </div>
                  <span>Articles & Publications</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('faq')}
                  className="text-slate-400 hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer group"
                >
                  <div className="p-1 rounded bg-slate-800 text-slate-400 border border-slate-700 group-hover:bg-slate-700 transition-colors">
                    <HelpCircle className="w-3 h-3" />
                  </div>
                  <span>Frequently Asked Questions</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Secretariat & Contact */}
          <div className="space-y-3.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Secretariat
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{siteContent.secretariatAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${siteContent.contactEmail}`} className="hover:text-emerald-400 transition-colors truncate">
                  {siteContent.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-tight">{siteContent.contactPhone}</span>
              </div>
            </div>

            <div className="pt-1">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                <p className="font-semibold text-emerald-400 mb-0.5">Central Mosque Halqah</p>
                <p>Every Thursday 4:30 PM & Sunday 9:00 AM at FUD Central Mosque.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Social Media Connect Strip */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                Stay Connected with MSSN FUD Official Pages
              </h4>
              <p className="text-[11px] text-slate-400">
                Follow our official accounts on TikTok, Facebook, X (Twitter), and WhatsApp for live campus updates and Halqah reminders.
              </p>
            </div>
          </div>

          <SocialLinks variant="pills" />
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} Muslim Students' Society of Nigeria (MSSN), Federal University Dutse.
            </p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400 font-medium">Hope of the Ummah</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-400 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
              title="Official Portal (Officers Only)"
            >
              <Lock className="w-3 h-3" />
              <span>Officer Portal</span>
            </button>

            <span className="text-slate-700">•</span>

            <button
              onClick={scrollToTop}
              className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

