import React, { useState, useMemo } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { ELibraryItem, ELibraryCategory } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  BookMarked,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
  Tag
} from 'lucide-react';

export const AdminELibrary: React.FC = () => {
  const {
    elibrary,
    faculties,
    currentSession,
    addELibraryItem,
    updateELibraryItem,
    deleteELibraryItem,
    deleteMultipleELibraryItems
  } = useMSSNStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ELibraryItem | null>(null);

  // Form data
  const [formData, setFormData] = useState<Partial<ELibraryItem>>({
    title: '',
    description: '',
    category: 'past_questions',
    fileUrl: '',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    faculty: 'All Faculties',
    department: 'General Studies',
    level: 'All Levels',
    courseCode: '',
    session: currentSession?.name || '2026/2027',
    semester: 'Both Semesters',
    authorOrLecturer: 'MSSN FUD Directorate of Studies (DOS)'
  });

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // In-app Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Filtered list
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

  // Statistics
  const totalDownloads = useMemo(() => {
    return elibrary.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  }, [elibrary]);

  const pastQuestionsCount = useMemo(() => {
    return elibrary.filter((e) => e.category === 'past_questions').length;
  }, [elibrary]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'past_questions',
      fileUrl: '',
      fileSize: '3.1 MB',
      fileType: 'pdf',
      faculty: 'All Faculties',
      department: 'General',
      level: 'All Levels',
      courseCode: '',
      session: currentSession?.name || '2026/2027',
      semester: 'Both Semesters',
      authorOrLecturer: 'MSSN FUD Directorate of Studies (DOS)'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ELibraryItem) => {
    setEditingItem(item);
    setFormData(item);
    setModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    const payload = {
      title: formData.title || '',
      description: formData.description || '',
      category: (formData.category || 'past_questions') as ELibraryCategory,
      fileUrl:
        formData.fileUrl ||
        'https://fud.edu.ng/mssn/academic-repository/resource-download.pdf',
      fileSize: formData.fileSize || '1.8 MB',
      fileType: (formData.fileType || 'pdf') as 'pdf' | 'doc' | 'zip' | 'link',
      faculty: formData.faculty || 'All Faculties',
      department: formData.department || 'General',
      level: formData.level || 'All Levels',
      courseCode: formData.courseCode || '',
      session: formData.session || currentSession?.name || '2026/2027',
      semester: formData.semester || 'Both Semesters',
      authorOrLecturer:
        formData.authorOrLecturer || 'MSSN FUD Directorate of Studies (DOS)',
      uploadedBy: 'Directorate of Studies (DOS)'
    };

    if (editingItem) {
      updateELibraryItem({
        ...editingItem,
        ...payload
      });
    } else {
      addELibraryItem(payload);
    }

    setModalOpen(false);
  };

  // Delete Handlers
  const handleConfirmSingleDelete = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setIsBulkDelete(false);
    setDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDelete(true);
    setDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (isBulkDelete) {
      deleteMultipleELibraryItems(selectedIds);
      setSelectedIds([]);
    } else if (itemToDelete) {
      deleteELibraryItem(itemToDelete.id);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
    setIsBulkDelete(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories: { id: ELibraryCategory; label: string }[] = [
    { id: 'past_questions', label: 'Past Examination Questions' },
    { id: 'lecture_notes', label: 'Lecture Summary Notes' },
    { id: 'handouts', label: 'Course Handouts & Syllabus' },
    { id: 'constitution', label: 'MSSN Constitution & By-Laws' },
    { id: 'academic_guide', label: 'Academic Guidelines' },
    { id: 'islamic_book', label: 'Islamic Books & Du’a Compilations' },
    { id: 'magazine', label: 'Al-Nur Magazine & Articles' }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              E-Library & Academic Resource Repository CMS
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage downloadable past exam papers, faculty lecture notes, academic guides, and Islamic literature for FUD students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleConfirmBulkDelete}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">Past Exam Papers</p>
            <h3 className="text-lg font-extrabold text-slate-900">
              {pastQuestionsCount} Papers
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">Total Documents</p>
            <h3 className="text-lg font-extrabold text-slate-900">
              {elibrary.length} Resources
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">Total Downloads</p>
            <h3 className="text-lg font-extrabold text-slate-900">
              {totalDownloads}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">Faculties Covered</p>
            <h3 className="text-lg font-extrabold text-slate-900">
              {faculties.length} Faculties
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, course code (e.g. GST 111), keyword, or lecturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 outline-none"
            >
              <option value="all">All Faculties</option>
              {faculties.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 outline-none"
            >
              <option value="all">All Levels</option>
              <option value="100 Level">100 Level</option>
              <option value="200 Level">200 Level</option>
              <option value="300 Level">300 Level</option>
              <option value="400 Level">400 Level</option>
              <option value="500 Level">500 Level</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-fade-in">
            <span className="text-xs font-bold text-emerald-900">
              {selectedIds.length} document(s) selected
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold px-2 py-1"
              >
                Clear Selection
              </button>
              <button
                onClick={handleConfirmBulkDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-800">
              No E-Library Documents Found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No academic materials match your current search or filter criteria. Click "Upload New Material" to add files.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Upload Material
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredItems.length > 0 &&
                        selectedIds.length === filteredItems.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded-md border-slate-300 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Material / Course</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Faculty / Level</th>
                  <th className="p-4">File Details</th>
                  <th className="p-4 text-center">Downloads</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded-md border-slate-300 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-xs">
                            {item.title}
                          </h4>
                          {item.courseCode && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[10px]">
                              {item.courseCode}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>By: {item.authorOrLecturer || 'DOS MSSN'}</span>
                          <span>•</span>
                          <span>Uploaded: {item.uploadDate}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.category === 'past_questions'
                              ? 'bg-amber-100 text-amber-900'
                              : item.category === 'handouts' || item.category === 'lecture_notes'
                              ? 'bg-teal-100 text-teal-900'
                              : item.category === 'constitution'
                              ? 'bg-purple-100 text-purple-900'
                              : item.category === 'islamic_book'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-indigo-100 text-indigo-900'
                          }`}
                        >
                          {item.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-800 text-[11px]">
                          {item.faculty}
                        </p>
                        <p className="text-slate-500 text-[10px]">
                          {item.level || 'All Levels'}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-mono font-bold uppercase">
                          {item.fileType} • {item.fileSize}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs">
                          {item.downloadCount || 0}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800 rounded-xl cursor-pointer transition-colors"
                            title="Edit Document"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              handleConfirmSingleDelete(item.id, item.title)
                            }
                            className="p-1.5 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 rounded-xl cursor-pointer transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>
                  {editingItem ? 'Edit E-Library Material' : 'Upload Academic Material'}
                </span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. GST 111 Past Questions (2021-2025 Solved Comprehensive Compilation)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category || 'past_questions'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ELibraryCategory
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Course Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.courseCode || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, courseCode: e.target.value })
                    }
                    placeholder="e.g. GST 111, MTH 101, CSC 301"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Resource Summary / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Comprehensive summary of covered topics, answers, and study notes..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Faculty</label>
                  <select
                    value={formData.faculty || 'All Faculties'}
                    onChange={(e) =>
                      setFormData({ ...formData, faculty: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="All Faculties">All Faculties (General)</option>
                    {faculties.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Academic Level</label>
                  <select
                    value={formData.level || 'All Levels'}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="100 Level">100 Level</option>
                    <option value="200 Level">200 Level</option>
                    <option value="300 Level">300 Level</option>
                    <option value="400 Level">400 Level</option>
                    <option value="500 Level">500 Level</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">
                    Download File URL / Cloud Storage Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.fileUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, fileUrl: e.target.value })
                    }
                    placeholder="https://drive.google.com/... or https://fud.edu.ng/..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">File Type</label>
                  <select
                    value={formData.fileType || 'pdf'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fileType: e.target.value as 'pdf' | 'doc' | 'zip' | 'link'
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-mono uppercase"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="doc">Word DOCX</option>
                    <option value="zip">ZIP Archive</option>
                    <option value="link">Web Link</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Author / Lecturer / Curator
                  </label>
                  <input
                    type="text"
                    value={formData.authorOrLecturer || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, authorOrLecturer: e.target.value })
                    }
                    placeholder="e.g. MSSN FUD Directorate of Studies (DOS)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Estimated File Size
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize || '2.4 MB'}
                    onChange={(e) =>
                      setFormData({ ...formData, fileSize: e.target.value })
                    }
                    placeholder="e.g. 2.4 MB"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Updates' : 'Publish Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation In-App Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">
                {isBulkDelete ? 'Confirm Bulk Deletion' : 'Delete E-Library Document'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isBulkDelete
                  ? `Are you sure you want to permanently delete ${selectedIds.length} selected document(s) from the repository? This action cannot be undone.`
                  : `Are you sure you want to delete "${itemToDelete?.title}"? Students will no longer be able to download this file.`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
