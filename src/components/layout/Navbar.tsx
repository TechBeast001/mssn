import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { useDutsePrayerTimes } from '../../hooks/useDutsePrayerTimes';
import { HeaderBrand } from '../common/HeaderBrand';
import { SocialLinks } from '../common/SocialLinks';
import {
  Menu,
  X,
  UserPlus,
  ShieldCheck,
  Volume2,
  Heart,
  Calendar,
  Sparkles,
  BookOpen,
  Users,
  ChevronDown,
  ChevronRight,
  Home,
  Info,
  HelpCircle,
  Phone,
  GraduationCap,
  Images,
  FileText,
  Search,
  ExternalLink,
  Clock
} from 'lucide-react';

export type PublicTab =
  | 'home'
  | 'about'
  | 'leadership'
  | 'committees'
  | 'events'
  | 'gallery'
  | 'blog'
  | 'elibrary'
  | 'donations'
  | 'contact'
  | 'faq'
  | 'verify';

interface NavbarProps {
  activeTab: PublicTab;
  onTabChange: (tab: PublicTab) => void;
  onOpenRegistration: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenRegistration
}) => {
  const { siteContent, currentSession } = useMSSNStore();
  const { nextPrayer, countdownHuman, dutseLocalTimeString, hijriDate } = useDutsePrayerTimes();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<'about' | 'academics' | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<'about' | 'academics' | null>(null);
  const [mobileVerifyInput, setMobileVerifyInput] = useState('');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener to close dropdowns or mobile menu with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Automatically expand corresponding dropdown in mobile drawer if activeTab matches
  useEffect(() => {
    if (['about', 'leadership', 'committees', 'faq'].includes(activeTab)) {
      setMobileOpenDropdown('about');
    } else if (['elibrary', 'events', 'gallery', 'blog'].includes(activeTab)) {
      setMobileOpenDropdown('academics');
    }
  }, [activeTab]);

  // Dropdown hover & click handlers with safe grace delay
  const handleDropdownClick = (e: React.MouseEvent, menu: 'about' | 'academics') => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(prev => (prev === menu ? null : menu));
  };

  const handleMouseEnter = (menu: 'about' | 'academics') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 280);
  };

  const isAboutActive = ['about', 'leadership', 'committees', 'faq'].includes(activeTab);
  const isAcademicsActive = ['elibrary', 'events', 'gallery', 'blog'].includes(activeTab);

  const announcements = [
    siteContent.announcementTicker ||
      `Registration for ${currentSession.name} Academic Session is currently ongoing — Register online to generate your digital e-ID card.`,
    'Free GST & Faculty Tutorials hold every Saturday 8:30 AM at Twin Lecture Theatre B.',
    'Weekly Campus Quranic Halqah & Usrah: Thursdays 4:30 PM at FUD Central Mosque.',
    'Support the MSSN FUD Student Welfare Fund for indigent students in need of tuition & hostel relief.'
  ];

  const handleMobileVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileVerifyInput.trim()) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('verify', mobileVerifyInput.trim());
        window.history.pushState({}, '', url.toString());
      } catch {
        // safe fallback
      }
      onTabChange('verify');
      setMobileMenuOpen(false);
    } else {
      onTabChange('verify');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header ref={navContainerRef} className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* 1. TOP UTILITY & TICKER BAR */}
      {siteContent.isAnnouncementActive && (
        <div className="bg-[#06331E] text-white text-xs py-1.5 px-4 border-b border-[#042013] flex items-center justify-between relative overflow-hidden select-none">
          {/* Static Notice Pill */}
          <div className="flex items-center gap-2 bg-[#06331E] z-10 pr-3 shrink-0">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1 shadow-xs">
              <Volume2 className="w-3 h-3 text-slate-950" />
              <span>Notice</span>
            </span>
          </div>

          {/* Marquee Ticker */}
          <div className="overflow-hidden whitespace-nowrap flex-1 flex">
            <div className="animate-marquee inline-flex items-center gap-10 text-xs font-medium text-emerald-100/90">
              {announcements.map((text, idx) => (
                <span key={idx} className="inline-flex items-center gap-3">
                  <span>{text}</span>
                  <span className="text-amber-400 font-bold">✦</span>
                </span>
              ))}
              {announcements.map((text, idx) => (
                <span key={`dup-${idx}`} className="inline-flex items-center gap-3">
                  <span>{text}</span>
                  <span className="text-amber-400 font-bold">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Session Badge, Prayer Badge, Social Links & Quick Verify */}
          <div className="hidden lg:flex items-center gap-2.5 bg-[#06331E] z-10 pl-3 shrink-0 text-emerald-200 text-xs">
            {/* Live Dutse Prayer Badge */}
            <div
              onClick={() => onTabChange('home')}
              className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="Real-time Prayer Times for Dutse, Jigawa State"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dutse: {nextPrayer.name} ({countdownHuman})</span>
            </div>

            <span className="text-white/20">|</span>

            <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 font-mono text-[10px] font-bold border border-white/15">
              {currentSession.name}
            </span>
            <span className="text-white/20">|</span>
            <SocialLinks variant="header" />
            <span className="text-white/20">|</span>
            <button
              onClick={() => onTabChange('verify')}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold text-xs transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify e-ID</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Institutional Dual Emblem & Brand Name */}
          <div
            onClick={() => {
              onTabChange('home');
              setActiveDropdown(null);
            }}
            className="cursor-pointer py-1 transition-transform hover:scale-[1.01]"
          >
            <HeaderBrand size="md" subtitleClassName="hidden xl:inline-block" />
          </div>

          {/* Center: Clean, Hierarchical Menu (No clutter!) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50/90 p-1.5 rounded-2xl border border-slate-200/80">
            {/* 1. Home */}
            <button
              onClick={() => {
                onTabChange('home');
                setActiveDropdown(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-white'
              }`}
            >
              Home
            </button>

            {/* 2. About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={(e) => handleDropdownClick(e, 'about')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  isAboutActive || activeDropdown === 'about'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-white'
                }`}
                aria-haspopup="true"
                aria-expanded={activeDropdown === 'about'}
              >
                <span>About Us</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'about' ? 'rotate-180 text-amber-300' : 'text-slate-500'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === 'about' && (
                <div
                  className="absolute top-full left-0 pt-2 z-[70] w-80 animate-fade-in before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                  onMouseEnter={() => handleMouseEnter('about')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl border border-slate-200/90 shadow-2xl bg-white p-2.5 space-y-1 ring-1 ring-black/5">
                    <button
                      onClick={() => {
                        onTabChange('about');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'about' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                          About the Chapter
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Ethos, mission, history & constitution
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('leadership');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'leadership' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                          Executive Leadership
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Amir & Central Executive Cabinet
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('committees');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'committees' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                          Committees & Wings
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Academic, Da'wah, Welfare & Editorial
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('faq');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'faq' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                          Frequently Asked Questions
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Membership, tutorials & student guides
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Academics & Programs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('academics')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={(e) => handleDropdownClick(e, 'academics')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  isAcademicsActive || activeDropdown === 'academics'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-white'
                }`}
                aria-haspopup="true"
                aria-expanded={activeDropdown === 'academics'}
              >
                <span>Academics & Media</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'academics' ? 'rotate-180 text-amber-300' : 'text-slate-500'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === 'academics' && (
                <div
                  className="absolute top-full left-0 pt-2 z-[70] w-84 animate-fade-in before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']"
                  onMouseEnter={() => handleMouseEnter('academics')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl border border-slate-200/90 shadow-2xl bg-white p-2.5 space-y-1 ring-1 ring-black/5">
                    <button
                      onClick={() => {
                        onTabChange('elibrary');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'elibrary' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                            E-Library & Past Questions
                          </span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Free
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          100L-500L past exam papers & summaries
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('events');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'events' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                          Campus Events & Halqahs
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Lectures, Usrah, tutorials & orientation
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('gallery');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'gallery' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <Images className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                          Photo & Activity Gallery
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Campus moments, inductions & conferences
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onTabChange('blog');
                        setActiveDropdown(null);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer group ${
                        activeTab === 'blog' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-amber-300 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                          Articles & Da'wah Publications
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Islamic essays, student reflections & reminders
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Sadaqah Welfare Fund */}
            <button
              onClick={() => {
                onTabChange('donations');
                setActiveDropdown(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'donations'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'donations' ? 'text-amber-300 fill-amber-300' : 'text-rose-500'}`} />
              <span>Sadaqah Relief</span>
            </button>

            {/* 5. Verify e-ID */}
            <button
              onClick={() => {
                onTabChange('verify');
                setActiveDropdown(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'verify'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-white'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'verify' ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span>Verify e-ID</span>
            </button>

            {/* 6. Contact */}
            <button
              onClick={() => {
                onTabChange('contact');
                setActiveDropdown(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-white'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right: Primary Call to Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                onOpenRegistration();
                setActiveDropdown(null);
              }}
              className="px-5 py-2.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95 group"
            >
              <UserPlus className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Register & Get e-ID</span>
            </button>
          </div>

          {/* Mobile & Tablet Trigger Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenRegistration}
              className="sm:hidden px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Get e-ID</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="px-3 py-2 rounded-xl text-slate-800 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none cursor-pointer transition-all border border-slate-200/90 flex items-center gap-2 font-black text-xs shadow-2xs active:scale-95 select-none"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-emerald-800" />
              ) : (
                <Menu className="w-5 h-5 text-emerald-800" />
              )}
              <span className="hidden sm:inline text-slate-800 font-extrabold">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* 3. MOBILE & TABLET SLIDE-OVER NAVIGATION DRAWER (Portaled to document.body for full viewport coverage) */}
    {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
      <div
        className="fixed inset-0 z-[99999] flex justify-end bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setMobileMenuOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="MSSN FUD Mobile and Tablet Navigation Menu"
      >
        {/* Slide-out Drawer Panel */}
        <div
          className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[440px] h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in-right relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="bg-[#06331E] text-white p-4 border-b border-emerald-950 flex items-center justify-between shrink-0 shadow-md">
            <div
              onClick={() => {
                onTabChange('home');
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer"
            >
              <HeaderBrand size="sm" variant="light" compact={true} />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-black transition-colors cursor-pointer border border-white/15 active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-amber-400" />
              <span>Close</span>
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Live Dutse Prayer Status Card */}
            <div
              onClick={() => {
                onTabChange('home');
                setMobileMenuOpen(false);
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-[#06331E] to-[#0a482c] text-white border border-emerald-700/60 shadow-xs flex items-center justify-between cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400" />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 font-mono">
                    Dutse Prayer Time (FUD)
                  </div>
                  <div className="text-xs font-black text-amber-300">
                    Next: {nextPrayer.name} ({countdownHuman})
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs font-black text-white">{dutseLocalTimeString}</div>
                <div className="text-[10px] text-emerald-200 font-semibold">{hijriDate.readable || '1448 AH'}</div>
              </div>
            </div>

            {/* Quick Matric / e-ID Verification input */}
            <form onSubmit={handleMobileVerifySubmit} className="relative">
              <input
                type="text"
                value={mobileVerifyInput}
                onChange={(e) => setMobileVerifyInput(e.target.value)}
                placeholder="Verify Matric No (e.g. FUD/22/SCI/042)..."
                className="w-full pl-9 pr-18 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-[11px] font-bold cursor-pointer hover:bg-emerald-900 active:scale-95"
              >
                Verify
              </button>
            </form>

            {/* Navigation Sections */}
            <div className="space-y-2">
              {/* Home */}
              <button
                type="button"
                onClick={() => {
                  onTabChange('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-amber-300' : 'text-emerald-700'}`} />
                  <span className="text-xs">Home</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* About Us Accordion */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'about' ? null : 'about')}
                  className="w-full p-3 flex items-center justify-between text-left text-xs font-black text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer select-none"
                  aria-expanded={mobileOpenDropdown === 'about'}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Info className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-extrabold text-xs">About Us</div>
                      <div className="text-[10px] text-slate-500 font-medium">Ethos, leadership & committees</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      {mobileOpenDropdown === 'about' ? 'Hide' : 'View'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        mobileOpenDropdown === 'about' ? 'rotate-180 text-emerald-800' : ''
                      }`}
                    />
                  </div>
                </button>

                {mobileOpenDropdown === 'about' && (
                  <div className="p-2 pt-0 space-y-1 bg-white border-t border-slate-200/70 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('about');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        activeTab === 'about' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs">About the Chapter</div>
                        <div className="text-[10px] opacity-75 font-normal">Ethos, history, mission & constitution</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('leadership');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        activeTab === 'leadership' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs">Executive Leadership</div>
                        <div className="text-[10px] opacity-75 font-normal">Amir & Central Executive Cabinet</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('committees');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        activeTab === 'committees' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs">Committees & Wings</div>
                        <div className="text-[10px] opacity-75 font-normal">Academic, Da'wah, Welfare & Media</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('faq');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        activeTab === 'faq' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs">Frequently Asked Questions</div>
                        <div className="text-[10px] opacity-75 font-normal">Student FAQs, tutorials & membership guide</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Academics & Media Accordion */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMobileOpenDropdown(mobileOpenDropdown === 'academics' ? null : 'academics')}
                  className="w-full p-3 flex items-center justify-between text-left text-xs font-black text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer select-none"
                  aria-expanded={mobileOpenDropdown === 'academics'}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-extrabold text-xs">Academics & Media</div>
                      <div className="text-[10px] text-slate-500 font-medium">E-library, events, gallery & blog</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      {mobileOpenDropdown === 'academics' ? 'Hide' : 'View'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        mobileOpenDropdown === 'academics' ? 'rotate-180 text-emerald-800' : ''
                      }`}
                    />
                  </div>
                </button>

                {mobileOpenDropdown === 'academics' && (
                  <div className="p-2 pt-0 space-y-1 bg-white border-t border-slate-200/70 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('elibrary');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        activeTab === 'elibrary' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="text-xs">E-Library & Past Questions</div>
                          <div className="text-[10px] opacity-75 font-normal">100L-500L Past exam papers & summaries</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-300 text-slate-950">
                        Free
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('events');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        activeTab === 'events' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs">Campus Events & Halqahs</div>
                        <div className="text-[10px] opacity-75 font-normal">Lectures, Usrah, tutorials & orientation</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('gallery');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        activeTab === 'gallery' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Images className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs">Photo & Activity Gallery</div>
                        <div className="text-[10px] opacity-75 font-normal">Campus moments, inductions & conferences</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('blog');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                        activeTab === 'blog' ? 'bg-emerald-800 text-white' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs">Articles & Publications</div>
                        <div className="text-[10px] opacity-75 font-normal">Islamic essays, student reflections & reminders</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Sadaqah Relief */}
              <button
                type="button"
                onClick={() => {
                  onTabChange('donations');
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'donations'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-extrabold">Sadaqah Relief Fund</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* Verify Student e-ID */}
              <button
                type="button"
                onClick={() => {
                  onTabChange('verify');
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'verify'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-4 h-4 ${activeTab === 'verify' ? 'text-amber-300' : 'text-emerald-700'}`} />
                  <span className="text-xs">Verify Student e-ID</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* Secretariat Contact */}
              <button
                type="button"
                onClick={() => {
                  onTabChange('contact');
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'contact'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Phone className={`w-4 h-4 ${activeTab === 'contact' ? 'text-amber-300' : 'text-emerald-700'}`} />
                  <span className="text-xs">Secretariat Contact</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>

          {/* Sticky Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-3">
            <button
              type="button"
              onClick={() => {
                onOpenRegistration();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all hover:brightness-105"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Register Online & Download e-ID</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold text-slate-500">Official Social Channels:</span>
              <SocialLinks variant="pills" />
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};
