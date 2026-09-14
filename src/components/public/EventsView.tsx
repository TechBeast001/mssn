import React, { useState, useEffect } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { EventItem, EventCategory } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  X,
  Filter,
  CalendarCheck,
  Images,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2
} from 'lucide-react';

interface EventsViewProps {
  initialEventId?: string | null;
  onClearInitialEvent?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  initialEventId,
  onClearInitialEvent
}) => {
  const { events, currentSession } = useMSSNStore();
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(() => {
    if (initialEventId) {
      return events.find((e) => e.id === initialEventId) || null;
    }
    return null;
  });

  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Sync selectedEvent if initialEventId changes
  useEffect(() => {
    if (initialEventId) {
      const found = events.find((e) => e.id === initialEventId);
      if (found) {
        setSelectedEvent(found);
        setActivePhotoIndex(0);
      }
    }
  }, [initialEventId, events]);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'dawah', label: "Da'wah & Jihad Week" },
    { id: 'academic', label: 'Academic & Tutorials' },
    { id: 'sisters', label: "Sisters' Wing" },
    { id: 'ramadan', label: 'Ramadan & Fasting' },
    { id: 'orientation', label: 'Freshmen Orientation' },
    { id: 'social', label: 'Social & Sports' },
    { id: 'ivc', label: 'IVC & Camp' }
  ];

  const filteredEvents = events.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    return true;
  });

  const handleOpenEventModal = (event: EventItem) => {
    setSelectedEvent(event);
    setActivePhotoIndex(0);
  };

  const getEventImages = (event: EventItem): string[] => {
    if (event.images && event.images.length > 0) {
      return event.images;
    }
    return [event.flyerUrl].filter(Boolean);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Toast Notification */}
      {reminderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-bold">{reminderToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <Calendar className="w-4 h-4 text-emerald-700" />
          Programs & Events Calendar
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Chapter Events & Gatherings
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Stay connected with our spiritual lectures, academic tutorial bootcamps, and annual conferences across Federal University Dutse.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'upcoming'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Past Events Archive
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none bg-white focus:border-emerald-600"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const allImgs = getEventImages(event);
          const photoCount = allImgs.length;

          return (
            <div
              key={event.id}
              onClick={() => handleOpenEventModal(event)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={event.flyerUrl || allImgs[0]}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/90 text-amber-300 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {event.category}
                </div>

                {/* Multiple Photos Badge */}
                {photoCount > 1 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1.5 border border-white/20">
                    <Images className="w-3.5 h-3.5 text-amber-300" />
                    <span>{photoCount} Photos</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 text-emerald-950 text-xs font-extrabold shadow-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {new Date(event.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {event.summary}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500">
          <p className="font-bold text-slate-700">No events found matching your filter selection.</p>
        </div>
      )}

      {/* Event Details Modal with Photo Gallery */}
      {selectedEvent && (() => {
        const eventImages = getEventImages(selectedEvent);
        const currentActiveImg = eventImages[activePhotoIndex] || selectedEvent.flyerUrl;

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
              {/* Modal Active Photo Viewer */}
              <div className="relative h-72 bg-black overflow-hidden group">
                <img
                  src={currentActiveImg}
                  alt={selectedEvent.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    if (onClearInitialEvent) onClearInitialEvent();
                  }}
                  className="absolute top-4 right-4 p-2 text-white bg-black/60 hover:bg-black/90 rounded-full transition-colors z-20 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Fullscreen zoom button */}
                <button
                  onClick={() => setFullscreenImage(currentActiveImg)}
                  className="absolute top-4 left-4 p-2 text-white bg-black/60 hover:bg-black/90 rounded-full transition-colors z-20 cursor-pointer"
                  title="View full size"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Next / Previous arrows if multiple photos */}
                {eventImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : eventImages.length - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex((prev) => (prev < eventImages.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-full bg-black/75 text-white text-[11px] font-bold z-10 border border-white/20">
                      Photo {activePhotoIndex + 1} of {eventImages.length}
                    </div>
                  </>
                )}

                {/* Gradient banner on bottom of photo */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider inline-block mb-1">
                    {selectedEvent.category} • {selectedEvent.session}
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold leading-tight text-white drop-shadow-md">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              {/* Photo Thumbnails Strip if multiple photos */}
              {eventImages.length > 1 && (
                <div className="bg-slate-900 px-4 py-2.5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
                  {eventImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        idx === activePhotoIndex
                          ? 'border-amber-400 scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase block">Date & Time</span>
                    <p className="font-bold text-slate-900">
                      {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-emerald-800 font-semibold">{selectedEvent.time}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase block">Venue</span>
                    <p className="font-bold text-slate-900">{selectedEvent.venue}</p>
                    <p className="text-slate-500">Federal University Dutse</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-2">
                    Event Overview & Program Details
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedEvent.fullDetails}
                  </p>
                </div>

                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-2">
                      Keynote Scholars & Facilitators
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.speakers.map((sp, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      setReminderToast(`Calendar reminder set for ${selectedEvent.title}!`);
                      setTimeout(() => setReminderToast(null), 4000);
                    }}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <CalendarCheck className="w-4 h-4 text-amber-300" />
                    <span>Set Calendar Reminder</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Fullscreen Photo Lightbox */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full cursor-pointer z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={fullscreenImage}
              alt="Enlarged photo"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
