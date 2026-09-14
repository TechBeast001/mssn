import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { Article } from '../../types';
import {
  BookOpen,
  Search,
  Clock,
  User,
  Tag,
  X,
  Share2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface BlogViewProps {
  initialArticleId?: string | null;
  onClearInitialArticle?: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({
  initialArticleId,
  onClearInitialArticle
}) => {
  const { articles } = useMSSNStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    if (initialArticleId) {
      return articles.find((a) => a.id === initialArticleId) || null;
    }
    return null;
  });

  const categories = ['all', 'Spiritual & Tarbiyyah', 'Academic Excellence', 'Campus Life', "Sisters' Corner", 'Islamic Jurisprudence'];

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSummary = a.summary.toLowerCase().includes(q);
      const matchAuthor = a.author.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchAuthor) return false;
    }
    return true;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          Articles & Islamic Discourse
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          MSSN FUD Thought & Blog
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Academic blueprints, spiritual guidance, and student reflections from distinguished scholars and executive mentors at Federal University Dutse.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or authors..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Articles' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={art.coverImage}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/90 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                {art.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold mb-1">
                  <span>
                    {new Date(art.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                    {art.author.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-700 truncate max-w-[130px]">
                    {art.author}
                  </span>
                </div>

                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500">
          <p className="font-bold text-slate-700">No articles found matching your criteria.</p>
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            {/* Top Banner */}
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <button
                onClick={() => {
                  setSelectedArticle(null);
                  if (onClearInitialArticle) onClearInitialArticle();
                }}
                className="absolute top-4 right-4 p-2.5 text-white bg-black/50 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 inset-x-6 text-white space-y-1">
                <span className="px-2.5 py-1 rounded-md bg-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider inline-block">
                  {selectedArticle.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            {/* Author Meta Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{selectedArticle.author}</span>
                {selectedArticle.authorRole && (
                  <span className="text-emerald-800 font-semibold">({selectedArticle.authorRole})</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                <span>Published: {selectedArticle.publishedAt}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 max-h-[55vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
              {selectedArticle.content}

              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Topics:
                  </span>
                  {selectedArticle.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Reader
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
