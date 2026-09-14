import React, { useState, useRef } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { EventItem, EventCategory } from '../../types';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
  MapPin,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Images,
  Star,
  Check,
  Eye,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import {
  readMultipleFilesAsOptimizedDataUrls,
  readFileAsOptimizedDataUrl,
  IMAGE_LIMITS
} from '../../utils/imageUtils';

export const AdminEvents: React.FC = () => {
  const { events, sessions, currentSession, addEvent, updateEvent, deleteEvent } = useMSSNStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [isProcessingImages, setIsProcessingImages] = useState<boolean>(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<EventCategory>('academic');
  const [session, setSession] = useState<string>(currentSession.name);
  const [date, setDate] = useState<string>('2026-10-15');
  const [time, setTime] = useState<string>('10:00 AM');
  const [venue, setVenue] = useState<string>('Faculty of Science Lecture Theatre');
  const [flyerUrl, setFlyerUrl] = useState<string>(
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
  );
  const [images, setImages] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [fullDetails, setFullDetails] = useState<string>('');
  const [speakersInput, setSpeakersInput] = useState<string>('Sheikh Dr. Ahmad Sani, Brother Ibrahim');
  const [status, setStatus] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setTitle('');
    setCategory('academic');
    setSession(currentSession.name);
    setDate('2026-10-20');
    setTime('10:00 AM Prompt');
    setVenue('FUD Central Mosque Amphitheatre');
    const defaultFlyer = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';
    setFlyerUrl(defaultFlyer);
    setImages([
      defaultFlyer,
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80'
    ]);
    setSummary('Comprehensive revision bootcamp across all science & humanities courses.');
    setFullDetails(
      'Topics include GST courses, study methodologies, and Islamic academic ethics. Free study materials provided.'
    );
    setSpeakersInput('Academic Committee Tutors');
    setStatus('upcoming');
    setCustomUrlInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setTitle(event.title);
    setCategory(event.category);
    setSession(event.session);
    setDate(event.date);
    setTime(event.time);
    setVenue(event.venue);
    setFlyerUrl(event.flyerUrl);
    
    // Ensure flyer is part of images array if not already
    const existingImages = event.images && event.images.length > 0
      ? event.images
      : [event.flyerUrl].filter(Boolean);
    setImages(existingImages);

    setSummary(event.summary);
    setFullDetails(event.fullDetails);
    setSpeakersInput(event.speakers ? event.speakers.join(', ') : '');
    setStatus(event.status);
    setCustomUrlInput('');
    setShowModal(true);
  };

  // Handle Multi-file upload from disk
  const handleMultipleFilesChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length >= IMAGE_LIMITS.MAX_EVENT_IMAGES) {
      alert(`Maximum of ${IMAGE_LIMITS.MAX_EVENT_IMAGES} photos allowed per event to ensure optimal performance.`);
      return;
    }

    setIsProcessingImages(true);
    try {
      const remainingSlots = IMAGE_LIMITS.MAX_EVENT_IMAGES - images.length;
      const dataUrls = await readMultipleFilesAsOptimizedDataUrls(files, remainingSlots);
      if (dataUrls.length > 0) {
        setImages((prev) => {
          const combined = [...prev, ...dataUrls].slice(0, IMAGE_LIMITS.MAX_EVENT_IMAGES);
          // If flyerUrl wasn't set or was empty, set first uploaded image as flyer
          if (!flyerUrl || flyerUrl.trim() === '') {
            setFlyerUrl(dataUrls[0]);
          }
          return combined;
        });
      }
    } catch (err) {
      console.error('Failed to process image files:', err);
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Single Main Flyer file upload
  const handleSingleFlyerChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImages(true);
    try {
      const dataUrl = await readFileAsOptimizedDataUrl(files[0]);
      if (dataUrl) {
        setFlyerUrl(dataUrl);
        setImages((prev) => {
          if (!prev.includes(dataUrl)) {
            return [dataUrl, ...prev].slice(0, IMAGE_LIMITS.MAX_EVENT_IMAGES);
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Failed to read flyer image:', err);
    } finally {
      setIsProcessingImages(false);
      if (singleFileInputRef.current) singleFileInputRef.current.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;
    if (images.length >= IMAGE_LIMITS.MAX_EVENT_IMAGES) {
      alert(`Maximum of ${IMAGE_LIMITS.MAX_EVENT_IMAGES} images per event reached.`);
      return;
    }
    setImages((prev) => [...prev, trimmed].slice(0, IMAGE_LIMITS.MAX_EVENT_IMAGES));
    if (!flyerUrl) {
      setFlyerUrl(trimmed);
    }
    setCustomUrlInput('');
  };

  const handleSetMainFlyer = (url: string) => {
    setFlyerUrl(url);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== indexToRemove);
      // If we removed the main flyer, reassign to the first available image
      if (prev[indexToRemove] === flyerUrl) {
        setFlyerUrl(filtered[0] || '');
      }
      return filtered;
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleMultipleFilesChange(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const speakers = speakersInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalFlyer = flyerUrl.trim() || images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';
    const finalImages = images.length > 0 ? images : [finalFlyer];

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: title.trim(),
        category,
        session,
        date,
        time: time.trim(),
        venue: venue.trim(),
        flyerUrl: finalFlyer,
        images: finalImages,
        summary: summary.trim(),
        fullDetails: fullDetails.trim(),
        speakers,
        status
      });
    } else {
      addEvent({
        title: title.trim(),
        category,
        session,
        date,
        time: time.trim(),
        venue: venue.trim(),
        flyerUrl: finalFlyer,
        images: finalImages,
        summary: summary.trim(),
        fullDetails: fullDetails.trim(),
        speakers,
        status
      });
    }

    setShowModal(false);
  };

  const handleDelete = (event: EventItem) => {
    setEventToDelete(event);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Programs & Events Manager
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish upcoming conferences, academic bootcamps, and attach multiple event photos and posters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Post New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const photoCount = event.images && event.images.length > 0 ? event.images.length : (event.flyerUrl ? 1 : 0);
          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-900 overflow-hidden group">
                <img
                  src={event.flyerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category & Status badges */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                    {event.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      event.status === 'upcoming'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-400 text-slate-900'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* Multi-image count badge */}
                {photoCount > 1 && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 text-amber-300 text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5 border border-amber-300/30 shadow-xs">
                    <Images className="w-3.5 h-3.5 text-amber-400" />
                    <span>{photoCount} Photos Attached</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    {event.date} • {event.time}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 mt-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {event.summary}
                  </p>
                </div>

                {/* Thumbnails preview if event has multiple images */}
                {event.images && event.images.length > 1 && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {event.images.slice(0, 4).map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setPreviewImageModal(imgUrl)}
                          className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                      {event.images.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-400 pl-1 shrink-0">
                          +{event.images.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    {event.venue}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(event)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-900 cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Event with Multi-Image Uploader */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-extrabold">
                  {editingEvent ? 'Edit Program / Event' : 'Create New Program / Event'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Event Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event / Program Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Jihad Week 2026: The Resilient Muslim Scholar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium text-xs text-slate-900"
                />
              </div>

              {/* Category, Session, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white font-medium"
                  >
                    <option value="dawah">Da'wah & Jihad Week</option>
                    <option value="academic">Academic & Tutorials</option>
                    <option value="sisters">Sisters' Wing</option>
                    <option value="social">Social & Sports</option>
                    <option value="ramadan">Ramadan & Fasting</option>
                    <option value="orientation">Orientation & Welcoming</option>
                    <option value="ivc">IVC & Camp</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Session</label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white font-mono font-medium"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as 'upcoming' | 'completed' | 'cancelled')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white font-bold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Date, Time, Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM Prompt"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Twin Lecture Theatre A"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-medium"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* MULTI-IMAGE & FLYER UPLOAD SECTION */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-extrabold text-xs">
                    <Images className="w-4 h-4 text-emerald-700" />
                    <span>Event Posters & Photo Gallery ({images.length} uploaded)</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    Upload multiple images or select main flyer
                  </span>
                </div>

                {/* Drag and drop upload zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-emerald-600 bg-emerald-100/70 scale-[1.01]'
                      : 'border-emerald-300 bg-white hover:bg-emerald-50/40'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={(e) => handleMultipleFilesChange(e.target.files)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-800">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-xs">
                        Click to select images or drag & drop here
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Supports multiple PNG, JPG, or WebP event photos and flyers
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional URL addition */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomUrl}
                    disabled={!customUrlInput.trim()}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {/* Processing Spinner */}
                {isProcessingImages && (
                  <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Processing and optimizing images...</span>
                  </div>
                )}

                {/* Uploaded Photos Grid & Primary Flyer Selection */}
                {images.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
                      <span>Click the star icon to set an image as the Main Cover Flyer:</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {images.map((imgUrl, idx) => {
                        const isMain = imgUrl === flyerUrl;
                        return (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 h-24 group transition-all ${
                              isMain ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />

                            {/* Main Flyer Tag */}
                            {isMain && (
                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-800 text-amber-300 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                                <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                                <span>Main Flyer</span>
                              </div>
                            )}

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainFlyer(imgUrl)}
                                  className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs cursor-pointer"
                                  title="Set as Main Cover Flyer"
                                >
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setPreviewImageModal(imgUrl)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shadow-xs cursor-pointer"
                                title="Zoom View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-xs cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-center rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>No photos uploaded yet. Select files or paste a direct image URL above.</span>
                  </div>
                )}
              </div>

              {/* Short Summary */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Summary (Displayed on cards)</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Provide a concise 1-2 sentence description of the program..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-medium"
                ></textarea>
              </div>

              {/* Full Details & Agenda */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Program Agenda & Description</label>
                <textarea
                  rows={3}
                  required
                  value={fullDetails}
                  onChange={(e) => setFullDetails(e.target.value)}
                  placeholder="Detailed schedule, requirements, handouts, topics, and timetable..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-medium"
                ></textarea>
              </div>

              {/* Keynote Speakers */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Keynote Speakers & Facilitators (Comma Separated)</label>
                <input
                  type="text"
                  value={speakersInput}
                  onChange={(e) => setSpeakersInput(e.target.value)}
                  placeholder="e.g. Sheikh Dr. Umar, Prof. Abdullahi, Amir Mal. Nasirudeen Albany"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>{editingEvent ? 'Update Event & Photos' : 'Publish Program & Photos'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Delete Event Record?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to delete this event? This cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-extrabold text-slate-900">
                {eventToDelete.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {eventToDelete.date} • {eventToDelete.venue}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Preview Modal */}
      {previewImageModal && (
        <div
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImageModal}
              alt="Enlarged preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
