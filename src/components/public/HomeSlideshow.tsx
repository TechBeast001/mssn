import React, { useState, useEffect, useMemo } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { PublicTab } from '../layout/Navbar';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Heart,
  CalendarDays,
  ShieldCheck,
  Pause,
  Play,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface HomeSlideshowProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenRegistration: () => void;
}

interface SlideItem {
  id: number | string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  primaryActionLabel: string;
  primaryAction: () => void;
  secondaryActionLabel: string;
  secondaryAction: () => void;
}

export const HomeSlideshow: React.FC<HomeSlideshowProps> = ({
  onTabChange,
  onOpenRegistration
}) => {
  const { siteContent, currentSession } = useMSSNStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamic slide resolution
  const slides: SlideItem[] = useMemo(() => {
    if (siteContent.heroSlides && siteContent.heroSlides.length > 0) {
      return siteContent.heroSlides
        .filter((s) => s.isActive !== false)
        .map((s, idx) => {
          const getAction = (target?: string, fallbackFn?: () => void) => {
            if (target === 'register') return onOpenRegistration;
            if (target === 'elibrary') return () => onTabChange('elibrary');
            if (target === 'about') return () => onTabChange('about');
            if (target === 'committees') return () => onTabChange('committees');
            if (target === 'events') return () => onTabChange('events');
            if (target === 'blog') return () => onTabChange('blog');
            if (target === 'donations') return () => onTabChange('donations');
            if (target === 'verify') return () => onTabChange('verify');
            return fallbackFn || onOpenRegistration;
          };

          return {
            id: s.id,
            badge: s.badge || `${currentSession.name} Academic Session`,
            badgeIcon:
              idx % 4 === 0 ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              ) : idx % 4 === 1 ? (
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              ) : idx % 4 === 2 ? (
                <CalendarDays className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Heart className="w-3.5 h-3.5 text-rose-300" />
              ),
            title: s.title,
            subtitle: s.subtitle,
            description: s.description,
            image: s.image,
            primaryActionLabel: s.primaryActionLabel || 'Register as a New Member',
            primaryAction: getAction(s.primaryActionTarget, onOpenRegistration),
            secondaryActionLabel: s.secondaryActionLabel || 'Explore E-Library',
            secondaryAction: getAction(s.secondaryActionTarget, () => onTabChange('elibrary'))
          };
        });
    }

    // Default Fallback
    return [
      {
        id: 1,
        badge: `${currentSession.name} Session • Official Chapter`,
        badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />,
        title: "Muslim Students' Society of Nigeria",
        subtitle: "Federal University Dutse Chapter • Jigawa State",
        description:
          "The official campus body representing Muslim students across all faculties at Federal University Dutse, fostering academic distinction, spiritual tarbiyyah, moral character, and student brotherhood.",
        image:
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80",
        primaryActionLabel: "Register for Digital e-ID",
        primaryAction: onOpenRegistration,
        secondaryActionLabel: "Free Past Questions Hub",
        secondaryAction: () => onTabChange('elibrary')
      },
      {
        id: 2,
        badge: "Academic Mentorship Division",
        badgeIcon: <BookOpen className="w-3.5 h-3.5 text-amber-300" />,
        title: "Free Faculty Tutorials & E-Library Past Questions",
        subtitle: "Empowering Academic Excellence Across All Departments",
        description:
          "Access curated 100L-500L past examination questions, revision lecture notes, and weekly organized faculty tutorials for Science, Computing, Management, and Medicine.",
        image:
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
        primaryActionLabel: "Browse E-Library Repository",
        primaryAction: () => onTabChange('elibrary'),
        secondaryActionLabel: "Tutorial Timetable",
        secondaryAction: () => onTabChange('events')
      }
    ];
  }, [siteContent.heroSlides, currentSession.name, onOpenRegistration, onTabChange]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-md border border-slate-800 bg-[#06331E] text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      <div className="relative min-h-[420px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[500px] w-full overflow-hidden flex items-center">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover scale-105 transform motion-safe:transition-transform motion-safe:duration-10000"
              referrerPolicy="no-referrer"
            />
            {/* Multi-tier gradient overlay for readability and luxury emerald glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06331E]/95 via-[#06331E]/85 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06331E] via-transparent to-black/40" />
          </div>
        ))}

        {/* Slide Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-center py-12">
          <div className="max-w-2xl space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-100 shadow-xs">
              {current.badgeIcon}
              <span>{current.badge}</span>
            </div>

            {/* Headlines */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {current.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-amber-300 tracking-wide uppercase font-mono">
                {current.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed max-w-xl font-normal">
              {current.description}
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                onClick={current.primaryAction}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer hover:shadow-lg active:scale-95 group"
              >
                <span>{current.primaryActionLabel}</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={current.secondaryAction}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-md transition-all cursor-pointer active:scale-95"
              >
                {current.secondaryActionLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-emerald-700 text-white border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-emerald-700 text-white border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Bar: Indicators & Counter */}
        <div className="absolute bottom-5 left-6 sm:left-10 lg:left-14 right-6 sm:right-10 lg:right-14 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-amber-400 shadow-sm' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-mono bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
              title={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <span className="font-bold">0{currentSlide + 1} / 0{slides.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
