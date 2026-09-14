import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { GalleryItem } from '../../types';
import { Image, X, Calendar, Filter, Sparkles, ZoomIn } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { gallery, sessions, currentSession } = useMSSNStore();
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['all', 'Jihad Week', 'Academics', 'Sisters Wing', "Welfare & Da'wah", 'Sports & Social', 'Orientation'];

  const filteredGallery = gallery.filter((item) => {
    if (selectedSession !== 'all' && item.session !== selectedSession) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <Image className="w-4 h-4 text-emerald-700" />
          Campus Moments & Memories
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Photo & Activity Gallery
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Capturing inspiring moments from Jihad Weeks, academic bootcamps, Quran recitation contests, and sisterhood gatherings at FUD.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Albums' : cat}
            </button>
          ))}
        </div>

        {/* Session Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Session:</span>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none bg-white"
          >
            <option value="all">All Sessions</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group relative h-72 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer bg-slate-900 border border-slate-200"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent"></div>

            {/* Top Badges */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/90 text-amber-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                {item.category}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/40 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                {item.session}
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-3 inset-x-4 text-white">
              <h3 className="font-extrabold text-sm leading-snug line-clamp-1">
                {item.title}
              </h3>
              {item.caption && (
                <p className="text-[11px] text-emerald-200 mt-1 line-clamp-1">
                  {item.caption}
                </p>
              )}
            </div>

            {/* Hover Zoom Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                <ZoomIn className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGallery.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500">
          <p className="font-bold text-slate-700">No photos found for the selected filter.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white animate-scale-up">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 text-white bg-black/60 hover:bg-black rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="w-full h-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-800 text-amber-300 text-[10px] font-bold uppercase">
                    {lightboxItem.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Session: {lightboxItem.session}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lightboxItem.title}
                </h3>
                {lightboxItem.caption && (
                  <p className="text-xs text-slate-300 mt-1">
                    {lightboxItem.caption}
                  </p>
                )}
              </div>

              <span className="text-xs text-slate-400 font-mono shrink-0">
                Date: {lightboxItem.date}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
