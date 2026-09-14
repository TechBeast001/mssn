import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { SiteContent, HeroSlide } from '../../types';
import { calculateAstronomicalDutseTimes, fetchDutsePrayerTimesFromAPI } from '../../utils/dutsePrayerTimes';
import {
  Globe,
  Sliders,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Eye,
  Volume2,
  BookOpen,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  RefreshCw,
  FileText
} from 'lucide-react';

export const AdminSiteContent: React.FC = () => {
  const { siteContent, updateSiteContent, currentSession } = useMSSNStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'slides' | 'announcements' | 'about' | 'prayer_hadith' | 'contact'
  >('slides');

  const [contentForm, setContentForm] = useState<SiteContent>({
    ...siteContent,
    heroSlides: siteContent.heroSlides || [],
    prayerTimes: siteContent.prayerTimes || {
      fajr: '05:18 AM',
      sunrise: '06:34 AM',
      dhuhr: '12:44 PM',
      asr: '04:06 PM',
      maghrib: '06:48 PM',
      isha: '07:58 PM',
      locationNotice: 'Dutse, Jigawa State (FUD Campus Mosque Timetable)'
    },
    hadithOfTheDay: siteContent.hadithOfTheDay || {
      arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
      translation: 'Whoever treads a path in pursuit of knowledge, Allah will facilitate for him a path to Paradise.',
      narratorOrSource: 'Sahih Muslim 2699',
      theme: 'Pursuit of Academic & Islamic Knowledge'
    }
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Hero Slide Modal State
  const [slideModalOpen, setSlideModalOpen] = useState<boolean>(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideFormData, setSlideFormData] = useState<Partial<HeroSlide>>({
    badge: 'Academic Excellence',
    title: '',
    subtitle: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80',
    primaryActionLabel: 'Register as Member',
    primaryActionTarget: 'register',
    secondaryActionLabel: 'About Us',
    secondaryActionTarget: 'about',
    isActive: true
  });

  // Core values state
  const [coreValues, setCoreValues] = useState<{ title: string; desc: string }[]>(
    contentForm.coreValues || []
  );

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = {
      ...contentForm,
      coreValues
    };
    updateSiteContent(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Slide CRUD Handlers
  const handleOpenNewSlide = () => {
    setEditingSlide(null);
    setSlideFormData({
      badge: '2026/2027 Session',
      title: '',
      subtitle: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80',
      primaryActionLabel: 'Register as Member',
      primaryActionTarget: 'register',
      secondaryActionLabel: 'Explore Details',
      secondaryActionTarget: 'about',
      isActive: true
    });
    setSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideFormData(slide);
    setSlideModalOpen(true);
  };

  const handleSaveSlideModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideFormData.title) return;

    let updatedSlides = [...(contentForm.heroSlides || [])];

    if (editingSlide) {
      updatedSlides = updatedSlides.map((s) =>
        s.id === editingSlide.id ? ({ ...s, ...slideFormData } as HeroSlide) : s
      );
    } else {
      const newSlide: HeroSlide = {
        id: Date.now(),
        badge: slideFormData.badge || 'Official Notice',
        title: slideFormData.title || '',
        subtitle: slideFormData.subtitle || '',
        description: slideFormData.description || '',
        image: slideFormData.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80',
        primaryActionLabel: slideFormData.primaryActionLabel || 'Explore',
        primaryActionTarget: slideFormData.primaryActionTarget || 'register',
        secondaryActionLabel: slideFormData.secondaryActionLabel || 'Learn More',
        secondaryActionTarget: slideFormData.secondaryActionTarget || 'about',
        order: updatedSlides.length + 1,
        isActive: slideFormData.isActive !== false
      };
      updatedSlides.push(newSlide);
    }

    const newContent = { ...contentForm, heroSlides: updatedSlides };
    setContentForm(newContent);
    updateSiteContent(newContent);
    setSlideModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteSlide = (id: number | string) => {
    const updatedSlides = (contentForm.heroSlides || []).filter((s) => s.id !== id);
    const newContent = { ...contentForm, heroSlides: updatedSlides };
    setContentForm(newContent);
    updateSiteContent(newContent);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = [...(contentForm.heroSlides || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const temp = slides[index];
    slides[index] = slides[targetIdx];
    slides[targetIdx] = temp;

    const newContent = { ...contentForm, heroSlides: slides };
    setContentForm(newContent);
    updateSiteContent(newContent);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Globe className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Live Website Content Management System (CMS)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empower non-technical executives to manage homepage hero slides, ticker notices, about us history, Dutse prayer timetable, and official contact information in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Published Live!</span>
            </span>
          )}

          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => handleSaveAll()}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish All</span>
          </button>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('slides')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'slides'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Hero Banner Slides ({contentForm.heroSlides?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'announcements'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Live Ticker & Notice Bar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'about'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>About Us, Vision & History</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prayer_hadith')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'prayer_hadith'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Dutse Prayer Times & Daily Hadith</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'contact'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Secretariat & Contact Details</span>
        </button>
      </div>

      {/* 1. HERO SLIDESHOW MANAGER */}
      {activeSubTab === 'slides' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Interactive Homepage Hero Slides
                </h3>
                <p className="text-slate-500 text-xs">
                  Reorder, customize, and publish background banners, titles, call-to-action buttons, and badges that greet visitors on the homepage.
                </p>
              </div>

              <button
                onClick={handleOpenNewSlide}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Hero Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {(contentForm.heroSlides || []).map((slide, index) => (
                <div
                  key={slide.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between group hover:border-emerald-500 transition-all shadow-xs"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                        {slide.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[11px] text-emerald-300 font-semibold">{slide.subtitle}</p>
                      <h4 className="font-extrabold text-sm leading-tight text-white line-clamp-1">
                        {slide.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                        CTA 1: {slide.primaryActionLabel} ({slide.primaryActionTarget})
                      </span>
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                        CTA 2: {slide.secondaryActionLabel} ({slide.secondaryActionTarget})
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveSlide(index, 'up')}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === (contentForm.heroSlides?.length || 0) - 1}
                          onClick={() => handleMoveSlide(index, 'down')}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-bold text-slate-400 ml-1">
                          Slide #{index + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditSlide(slide)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-1.5 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 rounded-xl cursor-pointer transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ANNOUNCEMENTS & TICKER */}
      {activeSubTab === 'announcements' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Top Announcement & Marquee Notice Bar
              </h3>
              <p className="text-slate-500 text-xs">
                Configure the continuous scrolling notification ticker displayed across the top header of every public page.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Notice Bar Status:</span>
              <button
                type="button"
                onClick={() =>
                  setContentForm({
                    ...contentForm,
                    isAnnouncementActive: !contentForm.isAnnouncementActive
                  })
                }
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  contentForm.isAnnouncementActive
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {contentForm.isAnnouncementActive ? 'Active & Visible' : 'Hidden / Inactive'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                Primary Marquee Broadcast Message
              </label>
              <textarea
                rows={3}
                value={contentForm.announcementTicker}
                onChange={(e) =>
                  setContentForm({ ...contentForm, announcementTicker: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="Enter urgent announcement or welcome message for all students..."
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: Use emojis like 📢, ✦, or 🕌 to make key updates pop.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>Live Bar Preview</span>
              </span>
              <div className="bg-[#093320] text-emerald-100 text-xs py-2 px-4 rounded-xl flex items-center gap-3 overflow-hidden">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wide shrink-0">
                  Notice
                </span>
                <p className="truncate text-xs font-medium">{contentForm.announcementTicker}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ABOUT US, VISION & HISTORY */}
      {activeSubTab === 'about' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Chapter Heritage, Vision & Inception History
            </h3>
            <p className="text-slate-500 text-xs">
              Manage the comprehensive founding narrative, vision statements, and core institutional values presented on the public "About" page.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                Chapter Founding History & Inception Narrative
              </label>
              <textarea
                rows={6}
                value={contentForm.aboutHistory}
                onChange={(e) =>
                  setContentForm({ ...contentForm, aboutHistory: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 leading-relaxed font-sans"
                placeholder="Narrate the history of MSSN at Federal University Dutse since 2011..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={4}
                  value={contentForm.vision}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, vision: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={4}
                  value={contentForm.mission}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, mission: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 leading-relaxed"
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800">
                  Core Institutional Values ({coreValues.length})
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setCoreValues([
                      ...coreValues,
                      { title: 'New Core Value', desc: 'Description of value...' }
                    ])
                  }
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Value</span>
                </button>
              </div>

              <div className="space-y-3">
                {coreValues.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={val.title}
                        onChange={(e) => {
                          const updated = [...coreValues];
                          updated[idx].title = e.target.value;
                          setCoreValues(updated);
                        }}
                        placeholder="Value title (e.g. Tawheed & Sincerity)"
                        className="sm:col-span-1 p-2 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={val.desc}
                        onChange={(e) => {
                          const updated = [...coreValues];
                          updated[idx].desc = e.target.value;
                          setCoreValues(updated);
                        }}
                        placeholder="Value explanation..."
                        className="sm:col-span-2 p-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCoreValues(coreValues.filter((_, i) => i !== idx))
                      }
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer shrink-0 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DUTSE PRAYER TIMES & DAILY HADITH */}
      {activeSubTab === 'prayer_hadith' && (
        <div className="space-y-6">
          {/* Prayer Times Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Dutse Campus Mosque Prayer Timetable
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Real-time Adhan timings for Dutse, Jigawa State (Latitude 11.7562° N, Longitude 9.3389° E).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const data = await fetchDutsePrayerTimesFromAPI();
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        fajr: data.times.fajr,
                        sunrise: data.times.sunrise,
                        dhuhr: data.times.dhuhr,
                        asr: data.times.asr,
                        maghrib: data.times.maghrib,
                        isha: data.times.isha,
                        locationNotice: 'FUD Central Mosque, Dutse, Jigawa State'
                      }
                    });
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 2500);
                  } catch {
                    const fallback = calculateAstronomicalDutseTimes();
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        fajr: fallback.fajr,
                        sunrise: fallback.sunrise,
                        dhuhr: fallback.dhuhr,
                        asr: fallback.asr,
                        maghrib: fallback.maghrib,
                        isha: fallback.isha,
                        locationNotice: 'FUD Central Mosque, Dutse, Jigawa State'
                      }
                    });
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Fetch Dutse Live Timings</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div>
                <label className="block font-bold text-slate-700 text-[11px] mb-1">Fajr (Dawn)</label>
                <input
                  type="text"
                  value={contentForm.prayerTimes?.fajr || '05:18 AM'}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        ...(contentForm.prayerTimes || {
                          fajr: '',
                          sunrise: '',
                          dhuhr: '',
                          asr: '',
                          maghrib: '',
                          isha: ''
                        }),
                        fajr: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-900 bg-emerald-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] mb-1">Sunrise (Shuruq)</label>
                <input
                  type="text"
                  value={contentForm.prayerTimes?.sunrise || '06:34 AM'}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        ...(contentForm.prayerTimes || {
                          fajr: '',
                          sunrise: '',
                          dhuhr: '',
                          asr: '',
                          maghrib: '',
                          isha: ''
                        }),
                        sunrise: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-amber-900 bg-amber-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] mb-1">Dhuhr (Noon)</label>
                <input
                  type="text"
                  value={contentForm.prayerTimes?.dhuhr || '12:44 PM'}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        ...(contentForm.prayerTimes || {
                          fajr: '',
                          sunrise: '',
                          dhuhr: '',
                          asr: '',
                          maghrib: '',
                          isha: ''
                        }),
                        dhuhr: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-900 bg-emerald-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] mb-1">Asr (Afternoon)</label>
                <input
                  type="text"
                  value={contentForm.prayerTimes?.asr || '04:06 PM'}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        ...(contentForm.prayerTimes || {
                          fajr: '',
                          sunrise: '',
                          dhuhr: '',
                          asr: '',
                          maghrib: '',
                          isha: ''
                        }),
                        asr: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-900 bg-emerald-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] mb-1">Maghrib (Sunset)</label>
                <input
                  type="text"
                  value={contentForm.prayerTimes?.maghrib || '06:48 PM'}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        ...(contentForm.prayerTimes || {
                          fajr: '',
                          sunrise: '',
                          dhuhr: '',
                          asr: '',
                          maghrib: '',
                          isha: ''
                        }),
                        maghrib: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-900 bg-emerald-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[11px] mb-1">Isha (Night)</label>
                <input
                  type="text"
                  value={contentForm.prayerTimes?.isha || '07:58 PM'}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      prayerTimes: {
                        ...(contentForm.prayerTimes || {
                          fajr: '',
                          sunrise: '',
                          dhuhr: '',
                          asr: '',
                          maghrib: '',
                          isha: ''
                        }),
                        isha: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-900 bg-emerald-50/50"
                />
              </div>
            </div>
          </div>

          {/* Daily Hadith / Spiritual Quote */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Hadith / Islamic Verse of the Day
                </h3>
                <p className="text-slate-500 text-xs">
                  Spiritual reminder displayed on the homepage widget with Arabic text and verified English translation.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  Arabic Text
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={contentForm.hadithOfTheDay?.arabic || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      hadithOfTheDay: {
                        ...(contentForm.hadithOfTheDay || {
                          arabic: '',
                          translation: '',
                          narratorOrSource: ''
                        }),
                        arabic: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-arabic font-bold text-right outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 text-xs mb-1">
                  English Translation
                </label>
                <textarea
                  rows={2}
                  value={contentForm.hadithOfTheDay?.translation || ''}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      hadithOfTheDay: {
                        ...(contentForm.hadithOfTheDay || {
                          arabic: '',
                          translation: '',
                          narratorOrSource: ''
                        }),
                        translation: e.target.value
                      }
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Narrator / Reference (Source)
                  </label>
                  <input
                    type="text"
                    value={contentForm.hadithOfTheDay?.narratorOrSource || ''}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hadithOfTheDay: {
                          ...(contentForm.hadithOfTheDay || {
                            arabic: '',
                            translation: '',
                            narratorOrSource: ''
                          }),
                          narratorOrSource: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Sahih Muslim 2699"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 text-xs mb-1">
                    Theme / Focus
                  </label>
                  <input
                    type="text"
                    value={contentForm.hadithOfTheDay?.theme || ''}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        hadithOfTheDay: {
                          ...(contentForm.hadithOfTheDay || {
                            arabic: '',
                            translation: '',
                            narratorOrSource: ''
                          }),
                          theme: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Seeking Knowledge, Sincerity, Kindness"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTACT & SECRETARIAT */}
      {activeSubTab === 'contact' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Official Secretariat, Inquiries & Social Handles
            </h3>
            <p className="text-slate-500 text-xs">
              Ensure student members and university authorities can reach the secretariat across verified communication channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={contentForm.contactEmail}
                onChange={(e) =>
                  setContentForm({ ...contentForm, contactEmail: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                Executive Helpline / Secretariat Phone Numbers
              </label>
              <input
                type="text"
                value={contentForm.contactPhone}
                onChange={(e) =>
                  setContentForm({ ...contentForm, contactPhone: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 text-xs mb-1">
                Secretariat Physical Address
              </label>
              <input
                type="text"
                value={contentForm.secretariatAddress}
                onChange={(e) =>
                  setContentForm({ ...contentForm, secretariatAddress: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                WhatsApp Secretariat Helpline URL
              </label>
              <input
                type="text"
                value={contentForm.whatsappUrl || ''}
                onChange={(e) =>
                  setContentForm({ ...contentForm, whatsappUrl: e.target.value })
                }
                placeholder="https://wa.me/2348031234567..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                TikTok Official Handle URL
              </label>
              <input
                type="text"
                value={contentForm.tiktokUrl || ''}
                onChange={(e) =>
                  setContentForm({ ...contentForm, tiktokUrl: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                Facebook Official Page URL
              </label>
              <input
                type="text"
                value={contentForm.facebookUrl || ''}
                onChange={(e) =>
                  setContentForm({ ...contentForm, facebookUrl: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 text-xs mb-1">
                X (Twitter) Official Handle URL
              </label>
              <input
                type="text"
                value={contentForm.twitterUrl || ''}
                onChange={(e) =>
                  setContentForm({ ...contentForm, twitterUrl: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Slide Modal */}
      {slideModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingSlide ? 'Edit Hero Banner Slide' : 'Create New Hero Slide'}
              </h3>
              <button
                onClick={() => setSlideModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveSlideModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    required
                    value={slideFormData.badge || ''}
                    onChange={(e) =>
                      setSlideFormData({ ...slideFormData, badge: e.target.value })
                    }
                    placeholder="e.g. 2026/2027 Academic Session"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Subtitle / Chapter</label>
                  <input
                    type="text"
                    value={slideFormData.subtitle || ''}
                    onChange={(e) =>
                      setSlideFormData({ ...slideFormData, subtitle: e.target.value })
                    }
                    placeholder="e.g. Federal University Dutse Chapter • Jigawa"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Slide Main Headline</label>
                <input
                  type="text"
                  required
                  value={slideFormData.title || ''}
                  onChange={(e) =>
                    setSlideFormData({ ...slideFormData, title: e.target.value })
                  }
                  placeholder="e.g. Muslim Students' Society of Nigeria"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-extrabold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={slideFormData.description || ''}
                  onChange={(e) =>
                    setSlideFormData({ ...slideFormData, description: e.target.value })
                  }
                  placeholder="Comprehensive description of chapter activities, programs, or benefits..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Background Image URL</label>
                <input
                  type="url"
                  required
                  value={slideFormData.image || ''}
                  onChange={(e) =>
                    setSlideFormData({ ...slideFormData, image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={slideFormData.primaryActionLabel || ''}
                    onChange={(e) =>
                      setSlideFormData({
                        ...slideFormData,
                        primaryActionLabel: e.target.value
                      })
                    }
                    placeholder="e.g. Register as a New Member"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Primary Button Action</label>
                  <select
                    value={slideFormData.primaryActionTarget || 'register'}
                    onChange={(e) =>
                      setSlideFormData({
                        ...slideFormData,
                        primaryActionTarget: e.target.value
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="register">Open Member Registration Modal</option>
                    <option value="elibrary">Go to E-Library & Past Questions</option>
                    <option value="about">Go to About Us Page</option>
                    <option value="committees">Go to Committees & Wings</option>
                    <option value="events">Go to Programs Calendar</option>
                    <option value="blog">Go to Islamic Articles</option>
                    <option value="donations">Go to Sadaqah Relief</option>
                    <option value="verify">Go to Verify Member e-ID</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Secondary Button Label</label>
                  <input
                    type="text"
                    value={slideFormData.secondaryActionLabel || ''}
                    onChange={(e) =>
                      setSlideFormData({
                        ...slideFormData,
                        secondaryActionLabel: e.target.value
                      })
                    }
                    placeholder="e.g. About Our Chapter"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Secondary Button Action</label>
                  <select
                    value={slideFormData.secondaryActionTarget || 'about'}
                    onChange={(e) =>
                      setSlideFormData({
                        ...slideFormData,
                        secondaryActionTarget: e.target.value
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="about">Go to About Us Page</option>
                    <option value="elibrary">Go to E-Library & Past Questions</option>
                    <option value="register">Open Member Registration Modal</option>
                    <option value="committees">Go to Committees & Wings</option>
                    <option value="events">Go to Programs Calendar</option>
                    <option value="blog">Go to Islamic Articles</option>
                    <option value="donations">Go to Sadaqah Relief</option>
                    <option value="verify">Go to Verify Member e-ID</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base text-white">
                  Live Public Preview Simulation
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-slate-800 rounded-full cursor-pointer text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Bar Preview */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Header Ticker</span>
              <div className="bg-[#093320] text-emerald-100 text-xs py-2 px-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full">
                    Notice
                  </span>
                  <span className="text-xs">{contentForm.announcementTicker}</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono">
                  Session: {currentSession.name}
                </span>
              </div>
            </div>

            {/* Slide Preview */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">First Active Hero Slide</span>
              {contentForm.heroSlides && contentForm.heroSlides[0] ? (
                <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-slate-950 border border-slate-800 p-8 flex flex-col justify-end">
                  <img
                    src={contentForm.heroSlides[0].image}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="relative z-10 space-y-2 max-w-2xl">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide">
                      {contentForm.heroSlides[0].badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {contentForm.heroSlides[0].title}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {contentForm.heroSlides[0].description}
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <button className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                        {contentForm.heroSlides[0].primaryActionLabel}
                      </button>
                      <button className="px-4 py-2 bg-white/20 text-white font-bold rounded-xl text-xs">
                        {contentForm.heroSlides[0].secondaryActionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No slides configured.</p>
              )}
            </div>

            {/* Prayer & Hadith Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Dutse Prayer Times
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400">Fajr</span>
                    <p className="font-bold text-emerald-300">{contentForm.prayerTimes?.fajr}</p>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400">Dhuhr</span>
                    <p className="font-bold text-emerald-300">{contentForm.prayerTimes?.dhuhr}</p>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400">Asr</span>
                    <p className="font-bold text-emerald-300">{contentForm.prayerTimes?.asr}</p>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400">Maghrib</span>
                    <p className="font-bold text-emerald-300">{contentForm.prayerTimes?.maghrib}</p>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400">Isha</span>
                    <p className="font-bold text-emerald-300">{contentForm.prayerTimes?.isha}</p>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg">
                    <span className="text-[10px] text-slate-400">Sunrise</span>
                    <p className="font-bold text-amber-300">{contentForm.prayerTimes?.sunrise}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Hadith of the Day
                </span>
                <p className="text-xs font-arabic text-right text-emerald-200">
                  {contentForm.hadithOfTheDay?.arabic}
                </p>
                <p className="text-xs text-slate-300 italic">
                  "{contentForm.hadithOfTheDay?.translation}"
                </p>
                <p className="text-[10px] text-slate-400 text-right">
                  — {contentForm.hadithOfTheDay?.narratorOrSource}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
