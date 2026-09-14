import React, { useState, useRef } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { ExecutiveMember } from '../../types';
import { FUD_FACULTIES } from '../../data/mockDatabase';
import { readFileAsOptimizedDataUrl } from '../../utils/imageUtils';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Users,
  Search,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Link,
  ChevronDown
} from 'lucide-react';

const PRESET_AVATARS = [
  { label: 'Amir Portrait (Official)', url: '/amir.jpg' },
  { label: 'Brother Avatar 1', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Brother Avatar 2', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { label: 'Sister Avatar 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Sister Avatar 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' }
];

export const AdminExecutives: React.FC = () => {
  const {
    executives,
    sessions,
    currentSession,
    addExecutive,
    updateExecutive,
    deleteExecutive
  } = useMSSNStore();

  const [selectedSession, setSelectedSession] = useState<string>(currentSession.name);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingExec, setEditingExec] = useState<ExecutiveMember | null>(null);
  const [execToDelete, setExecToDelete] = useState<ExecutiveMember | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [portfolio, setPortfolio] = useState<string>('Amir (President)');
  const [arabicTitle, setArabicTitle] = useState<string>('الرئيس');
  const [matricNumber, setMatricNumber] = useState<string>('FUD/21/MED/002');
  const [faculty, setFaculty] = useState<string>(FUD_FACULTIES[5].name);
  const [department, setDepartment] = useState<string>(FUD_FACULTIES[5].departments[0]);
  const [level, setLevel] = useState<string>('500L');
  const [email, setEmail] = useState<string>('amir@mssnfud.org');
  const [phone, setPhone] = useState<string>('+234 803 123 4567');
  const [bio, setBio] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('/amir.jpg');
  const [photoSourceType, setPhotoSourceType] = useState<'upload' | 'url' | 'preset'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [order, setOrder] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const filteredExecutives = executives
    .filter((e) => e.session === selectedSession)
    .sort((a, b) => a.order - b.order);

  const currentFacultyObj = FUD_FACULTIES.find((f) => f.name === faculty) || FUD_FACULTIES[0];

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const facName = e.target.value;
    const fac = FUD_FACULTIES.find((f) => f.name === facName) || FUD_FACULTIES[0];
    setFaculty(facName);
    setDepartment(fac.departments[0] || '');
  };

  const handleOpenAdd = () => {
    setEditingExec(null);
    setName('');
    setPortfolio('Director of Studies');
    setArabicTitle('مدير الدراسات');
    setMatricNumber('FUD/22/SCI/044');
    setFaculty(FUD_FACULTIES[1].name);
    setDepartment(FUD_FACULTIES[1].departments[0]);
    setLevel('400L');
    setEmail('');
    setPhone('');
    setBio('');
    setPhotoUrl(PRESET_AVATARS[1].url);
    setUploadedFileName(null);
    setPhotoSourceType('upload');
    setOrder(filteredExecutives.length + 1);
    setShowModal(true);
  };

  const handleOpenEdit = (exec: ExecutiveMember) => {
    setEditingExec(exec);
    setName(exec.name);
    setPortfolio(exec.portfolio);
    setArabicTitle(exec.arabicTitle || '');
    setMatricNumber(exec.matricNumber || '');
    setFaculty(exec.faculty || FUD_FACULTIES[0].name);
    setDepartment(exec.department || '');
    setLevel(exec.level);
    setEmail(exec.email || '');
    setPhone(exec.phone || '');
    setBio(exec.bio || '');
    setPhotoUrl(exec.photoUrl);
    setUploadedFileName(null);
    setPhotoSourceType(exec.photoUrl.startsWith('data:') ? 'upload' : 'url');
    setOrder(exec.order);
    setShowModal(true);
  };

  // Image Upload Processing
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    try {
      const optimized = await readFileAsOptimizedDataUrl(file, 500, 500, 0.75);
      if (optimized) {
        setPhotoUrl(optimized);
        setUploadedFileName(file.name);
        setPhotoSourceType('upload');
        showToast('success', `Photo "${file.name}" optimized & loaded successfully!`);
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to process image file.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Please enter executive full name.');
      return;
    }

    if (!portfolio.trim()) {
      showToast('error', 'Please enter executive portfolio/position.');
      return;
    }

    setIsSaving(true);

    try {
      if (editingExec) {
        // Explicitly update executive
        updateExecutive({
          ...editingExec,
          id: editingExec.id,
          name: name.trim(),
          portfolio: portfolio.trim(),
          arabicTitle: arabicTitle.trim() || undefined,
          matricNumber: matricNumber.trim(),
          faculty: faculty.trim(),
          department: department.trim(),
          level,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          bio: bio.trim() || undefined,
          photoUrl: photoUrl.trim() || '/amir.jpg',
          order: Number(order) || 1,
          session: selectedSession
        });

        showToast('success', `Successfully updated executive profile for ${name.trim()}!`);
      } else {
        addExecutive({
          name: name.trim(),
          session: selectedSession,
          portfolio: portfolio.trim(),
          arabicTitle: arabicTitle.trim() || undefined,
          matricNumber: matricNumber.trim(),
          faculty: faculty.trim(),
          department: department.trim(),
          level,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          bio: bio.trim() || undefined,
          photoUrl: photoUrl.trim() || '/amir.jpg',
          order: Number(order) || 1
        });

        showToast('success', `Successfully added ${name.trim()} to Executive Council!`);
      }

      setShowModal(false);
    } catch (err: any) {
      showToast('error', err?.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (exec: ExecutiveMember) => {
    setExecToDelete(exec);
  };

  const handleConfirmDelete = () => {
    if (execToDelete) {
      deleteExecutive(execToDelete.id);
      showToast('success', `Removed ${execToDelete.name} from executive records.`);
      setExecToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold animate-slide-down ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-950/20'
              : 'bg-rose-900 text-white border-rose-700 shadow-rose-950/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-full hover:bg-white/20 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Executive Council Leadership
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain current and historical executive officers, portfolios, contact points, photos, and session tenures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Session Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Session:</span>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="py-1 rounded-xl text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} {s.isCurrent ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Add Executive</span>
          </button>
        </div>
      </div>

      {/* Executives List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExecutives.map((exec) => (
          <div
            key={exec.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={exec.photoUrl || '/amir.jpg'}
                  alt={exec.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/amir.jpg';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md shadow-xs">
                  #{exec.order}
                </span>
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold text-[10px] uppercase block truncate">
                  {exec.portfolio}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 truncate" title={exec.name}>
                  {exec.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {exec.department} • {exec.level}
                </p>
                {exec.matricNumber && (
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    {exec.matricNumber}
                  </p>
                )}
              </div>
            </div>

            {exec.bio && (
              <p className="text-xs text-slate-600 italic line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                "{exec.bio}"
              </p>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Session {exec.session}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(exec)}
                  className="p-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  title="Edit Executive"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(exec)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Executive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExecutives.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500 space-y-3">
          <Award className="w-10 h-10 mx-auto text-slate-300" />
          <p className="font-bold text-slate-700">No executives recorded for session {selectedSession}.</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Add first executive for this session
          </button>
        </div>
      )}

      {/* Modal Add / Edit with First-Class Photo Upload */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-800 text-amber-300">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">
                    {editingExec ? `Edit Executive Details: ${editingExec.name}` : 'Add New Executive Officer'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Session {selectedSession} Executive Council
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">
                    Executive Passport / Portrait Photo *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Supports file upload from Phone & PC
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative shrink-0 w-24 h-28 rounded-2xl overflow-hidden border-2 border-emerald-600 bg-slate-200 shadow-sm flex items-center justify-center">
                    <img
                      src={photoUrl || '/amir.jpg'}
                      alt="Executive Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/amir.jpg';
                      }}
                    />
                    {photoUrl.startsWith('data:') && (
                      <span className="absolute bottom-1 left-1 right-1 bg-emerald-800/90 text-white text-[9px] font-bold text-center py-0.5 rounded">
                        Uploaded
                      </span>
                    )}
                  </div>

                  {/* Upload Controls & Drag & Drop Area */}
                  <div className="flex-1 w-full space-y-2.5">
                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {/* Drag & Drop Box */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isDragging
                          ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                          : 'border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-emerald-800">
                        <div className="p-1.5 rounded-lg bg-emerald-100">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-xs">
                          Choose Photo from Phone or Computer
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Tap here to select from gallery/camera or drag and drop image (JPG, PNG, WEBP up to 5MB)
                      </p>
                    </div>

                    {uploadedFileName && (
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">Loaded: {uploadedFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileName(null);
                            setPhotoUrl('/amir.jpg');
                          }}
                          className="text-emerald-800 hover:text-emerald-950 font-bold ml-2 underline text-[11px]"
                        >
                          Reset
                        </button>
                      </div>
                    )}

                    {/* Presets & URL Fallback */}
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-semibold">Quick Presets:</span>
                      {PRESET_AVATARS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPhotoUrl(preset.url);
                            setUploadedFileName(null);
                            setPhotoSourceType('preset');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                            photoUrl === preset.url
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-600'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Image URL input as secondary option */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Link className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Or enter direct image URL (https://...)"
                      value={photoUrl.startsWith('data:') ? '' : photoUrl}
                      onChange={(e) => {
                        setPhotoUrl(e.target.value);
                        setUploadedFileName(null);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-[11px] font-mono outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mal. Nasirudeen Albany"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portfolio Position *</label>
                  <input
                    type="text"
                    required
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="e.g. Amir (President)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arabic Title (Optional)</label>
                  <input
                    type="text"
                    value={arabicTitle}
                    onChange={(e) => setArabicTitle(e.target.value)}
                    placeholder="e.g. الرئيس or أمير"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none font-arabic text-sm text-right"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Rank / Order *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none font-mono text-xs font-bold"
                  />
                </div>
              </div>

              {/* Academic & University Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matric Number</label>
                  <input
                    type="text"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    placeholder="e.g. FUD/21/MED/002"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty</label>
                  <select
                    value={faculty}
                    onChange={handleFacultyChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white text-xs"
                  >
                    {FUD_FACULTIES.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white text-xs font-semibold"
                  >
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. amir@mssnfud.org"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Bio & Vision */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio & Leadership Statement</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A brief message or quote on academic focus and Islamic leadership..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none text-xs leading-relaxed"
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{isSaving ? 'Saving...' : editingExec ? 'Save Changes' : 'Create Executive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Executive Delete Confirmation Modal */}
      {execToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Remove Executive?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove this executive officer from the Executive Council?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={execToDelete.photoUrl}
                alt={execToDelete.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-extrabold text-slate-900 truncate">
                  {execToDelete.name}
                </h4>
                <p className="text-[11px] text-emerald-800 font-bold">
                  {execToDelete.portfolio}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {execToDelete.session}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setExecToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Remove Executive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
