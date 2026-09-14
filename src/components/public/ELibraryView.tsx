import React, { useState, useMemo } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { ELibraryItem, ELibraryCategory } from '../../types';
import { PublicTab } from '../layout/Navbar';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  GraduationCap,
  BookMarked,
  Layers,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface ELibraryViewProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenRegistration: () => void;
}

export const ELibraryView: React.FC<ELibraryViewProps> = ({
  onTabChange,
  onOpenRegistration
}) => {
  const { elibrary, faculties, incrementELibraryDownload } = useMSSNStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const categories: { id: ELibraryCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Resources' },
    { id: 'past_questions', label: 'Past Exam Questions' },
    { id: 'lecture_notes', label: 'Lecture Summary Notes' },
    { id: 'handouts', label: 'Course Handouts' },
    { id: 'constitution', label: 'MSSN Constitution' },
    { id: 'islamic_book', label: 'Islamic Books & Du’a' },
    { id: 'academic_guide', label: 'Academic Guidelines' },
    { id: 'magazine', label: 'Al-Nur Magazine' }
  ];

  const levels = [
    'All Levels',
    '100 Level',
    '200 Level',
    '300 Level',
    '400 Level',
    '500 Level',
    'Postgraduate'
  ];

  const filteredItems = useMemo(() => {
    return elibrary.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authorOrLecturer?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchFaculty =
        selectedFaculty === 'all' ||
        item.faculty === selectedFaculty ||
        item.faculty === 'All Faculties';

      const matchLevel =
        selectedLevel === 'all' ||
        item.level === selectedLevel ||
        item.level === 'All Levels';

      return matchSearch && matchCat && matchFaculty && matchLevel;
    });
  }, [elibrary, searchQuery, selectedCategory, selectedFaculty, selectedLevel]);

  const handleDownload = (item: ELibraryItem) => {
    incrementELibraryDownload(item.id);
    setDownloadNotice(`Downloading "${item.title}"...`);
    setTimeout(() => setDownloadNotice(null), 3500);

    // Direct file opening/download
    if (item.fileUrl) {
      window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          Academic Excellence & Digital E-Library
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          FUD Past Questions & Academic Repository
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Access curated past examination papers, lecture summary notes, Islamic study circle literature, and the official MSSN Constitution prepared by the Directorate of Studies (DOS).
        </p>

        {downloadNotice && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-800 text-white text-xs font-bold shadow-md animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{downloadNotice}</span>
          </div>
        )}
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Past Exam Papers</p>
            <h4 className="text-xl font-extrabold text-slate-900">
              {elibrary.filter((i) => i.category === 'past_questions').length} Available
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-teal-700">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Lecture Handouts & Notes</p>
            <h4 className="text-xl font-extrabold text-slate-900">
              {
                elibrary.filter(
                  (i) => i.category === 'handouts' || i.category === 'lecture_notes'
                ).length
              }{' '}
              Documents
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Free Downloads</p>
            <h4 className="text-xl font-extrabold text-slate-900">
              {elibrary.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0)} Distributed
            </h4>
          </div>
        </div>
      </div>

      {/* Filter & Search Dashboard */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course code (e.g. GST 111, CSC 201), title, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-300 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium bg-slate-50 text-slate-700 outline-none"
            >
              <option value="all">All Faculties</option>
              {faculties.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium bg-slate-50 text-slate-700 outline-none"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl === 'All Levels' ? 'all' : lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-800">No Materials Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No academic resources matched your search filter. Try clearing your filters or searching for general keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedFaculty('all');
                setSelectedLevel('all');
              }}
              className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between p-6 space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                      item.category === 'past_questions'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : item.category === 'handouts' || item.category === 'lecture_notes'
                        ? 'bg-teal-100 text-teal-900 border border-teal-300'
                        : item.category === 'constitution'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : item.category === 'islamic_book'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                    }`}
                  >
                    {item.category.replace('_', ' ').toUpperCase()}
                  </span>

                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-mono text-[10px] font-bold uppercase">
                    {item.fileType} • {item.fileSize}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  {item.courseCode && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-xs">
                      {item.courseCode}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Faculty:</span>
                    <span>{item.faculty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Target Level:</span>
                    <span>{item.level || 'All Levels'}</span>
                  </div>
                  {item.authorOrLecturer && (
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Curator/Lecturer:</span>
                      <span className="truncate max-w-[150px]">{item.authorOrLecturer}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.downloadCount || 0} downloads
                </span>

                <button
                  onClick={() => handleDownload(item)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resource</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom CTA for Academic Submissions */}
      <div className="bg-gradient-to-br from-[#093320] to-[#14532D] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide">
            Contribute Past Questions
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Have Academic Past Questions or Summary Notes?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Share your clean semester exam questions or lecture notes with the Directorate of Studies (DOS) to support fellow Muslim brothers and sisters across all FUD departments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('contact')}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl transition-all shadow-md cursor-pointer"
          >
            Contact Secretariat / DOS
          </button>
        </div>
      </div>
    </div>
  );
};
