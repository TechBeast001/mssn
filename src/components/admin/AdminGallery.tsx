import React, { useState, useRef } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { GalleryItem } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  Layers,
  Search,
  Eye,
  CheckSquare,
  Square,
  AlertCircle,
  FolderPlus,
  Loader2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import {
  readFileAsOptimizedDataUrl,
  IMAGE_LIMITS
} from '../../utils/imageUtils';

interface StagedPhoto {
  id: string;
  dataUrl: string;
  name: string;
  caption: string;
}

export const AdminGallery: React.FC = () => {
  const {
    gallery,
    sessions,
    currentSession,
    addGalleryItem,
    addMultipleGalleryItems,
    deleteGalleryItem,
    deleteMultipleGalleryItems
  } = useMSSNStore();

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // In-App Deletion Confirmation Modals (Replaces blocked window.confirm)
  const [photoToDelete, setPhotoToDelete] = useState<GalleryItem | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form State
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Jihad Week');
  const [session, setSession] = useState<string>(currentSession.name);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [baseCaption, setBaseCaption] = useState<string>('');

  // Staged Photos for Batch Upload
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');

  // Gallery Overview Filtering & Selection
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSession, setFilterSession] = useState<string>('all');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Modal with fresh state
  const handleOpenAddModal = () => {
    setAlbumTitle('');
    setCategory('Jihad Week');
    setSession(currentSession.name);
    setDate(new Date().toISOString().split('T')[0]);
    setBaseCaption('');
    setStagedPhotos([]);
    setUrlInput('');
    setShowModal(true);
  };

  // Handle Multi-file Upload from File Input or Drag-Drop
  const handleFilesSelected = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = IMAGE_LIMITS.MAX_GALLERY_BATCH - stagedPhotos.length;
    if (remainingSlots <= 0) {
      showToast(`Maximum ${IMAGE_LIMITS.MAX_GALLERY_BATCH} photos can be uploaded in one batch.`, 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const fileList = Array.from(files).slice(0, remainingSlots);
      const newStaged: StagedPhoto[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.type.startsWith('image/')) continue;
        try {
          const optimized = await readFileAsOptimizedDataUrl(file, 800, 800, 0.72);
          if (optimized) {
            newStaged.push({
              id: `staged-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
              dataUrl: optimized,
              name: file.name.replace(/\.[^/.]+$/, ''),
              caption: ''
            });
          }
        } catch (e) {
          console.warn('Failed to compress file:', file.name, e);
        }
      }

      if (newStaged.length > 0) {
        setStagedPhotos((prev) => [...prev, ...newStaged]);
        showToast(`Loaded and optimized ${newStaged.length} photo(s).`, 'success');
      } else {
        showToast('No valid images could be processed.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error processing images.', 'error');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Photo via URL
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (stagedPhotos.length >= IMAGE_LIMITS.MAX_GALLERY_BATCH) {
      showToast(`Maximum ${IMAGE_LIMITS.MAX_GALLERY_BATCH} photos in a batch reached.`, 'error');
      return;
    }

    setStagedPhotos((prev) => [
      ...prev,
      {
        id: `staged-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        dataUrl: trimmed,
        name: `Photo ${prev.length + 1}`,
        caption: ''
      }
    ]);
    setUrlInput('');
  };

  // Remove individual staged photo
  const handleRemoveStagedPhoto = (id: string) => {
    setStagedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Update caption of individual staged photo
  const handleUpdateStagedCaption = (id: string, caption: string) => {
    setStagedPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  // Submit Batch to Store & Firestore
  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedPhotos.length === 0) {
      showToast('Please select or upload at least one photo.', 'error');
      return;
    }

    const masterTitle = albumTitle.trim() || 'Campus Moment';

    setIsProcessing(true);
    try {
      const itemsToCreate = stagedPhotos.map((photo, index) => {
        const itemTitle =
          stagedPhotos.length === 1
            ? masterTitle
            : `${masterTitle} (${index + 1}/${stagedPhotos.length})`;

        const itemCaption = photo.caption.trim() || baseCaption.trim() || undefined;

        return {
          title: itemTitle,
          category,
          session,
          imageUrl: photo.dataUrl,
          caption: itemCaption,
          date
        };
      });

      if (itemsToCreate.length === 1) {
        await addGalleryItem(itemsToCreate[0]);
      } else {
        await addMultipleGalleryItems(itemsToCreate);
      }

      showToast(`Successfully published ${itemsToCreate.length} photo(s) to Gallery!`, 'success');
      setShowModal(false);
      setStagedPhotos([]);
      setAlbumTitle('');
    } catch (err: any) {
      showToast(err.message || 'Failed to save photos to gallery.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger Single Delete In-App Confirmation
  const promptDeleteSingle = (item: GalleryItem) => {
    setPhotoToDelete(item);
  };

  // Confirm Single Delete
  const handleConfirmDeleteSingle = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGalleryItem(photoToDelete.id);
      setSelectedItemIds((prev) => prev.filter((id) => id !== photoToDelete.id));
      if (previewItem?.id === photoToDelete.id) {
        setPreviewItem(null);
      }
      showToast(`Deleted photo "${photoToDelete.title}".`, 'success');
      setPhotoToDelete(null);
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete photo.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Trigger Bulk Delete In-App Confirmation
  const promptBulkDelete = () => {
    if (selectedItemIds.length === 0) return;
    setShowBulkDeleteModal(true);
  };

  // Confirm Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedItemIds.length === 0) return;
    setIsDeleting(true);
    try {
      const count = selectedItemIds.length;
      await deleteMultipleGalleryItems(selectedItemIds);
      if (previewItem && selectedItemIds.includes(previewItem.id)) {
        setPreviewItem(null);
      }
      setSelectedItemIds([]);
      setShowBulkDeleteModal(false);
      showToast(`Successfully deleted ${count} selected photo(s).`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete selected photos.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all filtered
  const handleToggleSelectAll = () => {
    if (selectedItemIds.length === filteredGallery.length && filteredGallery.length > 0) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredGallery.map((i) => i.id));
    }
  };

  // Filtered List
  const filteredGallery = gallery.filter((item) => {
    if (filterSession !== 'all' && item.session !== filterSession) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCaption = (item.caption || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCaption) return false;
    }
    return true;
  });

  const categoriesList = [
    'Jihad Week',
    'Academics',
    'Sisters Wing',
    "Welfare & Da'wah",
    'Sports & Social',
    'Orientation',
    'Executive Meetings',
    'Special Programs'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold transition-all animate-slide-up ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-300" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <ImageIcon className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Photo & Media Gallery
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload and organize multi-photo albums, event coverage, and historical media for MSSN FUD.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedItemIds.length > 0 && (
            <button
              onClick={promptBulkDelete}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedItemIds.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FolderPlus className="w-4 h-4 text-amber-300" />
            <span>Upload Photos (Batch)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos by title or caption..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-emerald-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto justify-end">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Session Filter */}
          <select
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 outline-none font-bold text-slate-700 bg-white"
          >
            <option value="all">All Sessions</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Select All Toggle */}
          {filteredGallery.length > 0 && (
            <button
              onClick={handleToggleSelectAll}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Select / Deselect All"
            >
              {selectedItemIds.length === filteredGallery.length && filteredGallery.length > 0 ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                  <span>Select All</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredGallery.map((item) => {
          const isSelected = selectedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-md'
                  : 'border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setPreviewItem(item)}
                  referrerPolicy="no-referrer"
                />

                {/* Selection Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.id);
                  }}
                  className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer z-10"
                  title={isSelected ? 'Deselect photo' : 'Select photo'}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Square className="w-4 h-4 text-white/80" />
                  )}
                </button>

                {/* Action Controls */}
                <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem(item);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-emerald-700 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title="View Full Size"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      promptDeleteSingle(item);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Tags */}
                <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 text-amber-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                    {item.session}
                  </span>
                </div>
              </div>

              {/* Meta Card Details */}
              <div className="p-4 space-y-1.5 text-xs">
                <h4
                  onClick={() => setPreviewItem(item)}
                  className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {item.caption || 'No caption provided.'}
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">
                    {item.session}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGallery.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">No photos found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || filterCategory !== 'all' || filterSession !== 'all'
              ? 'Try clearing search or filter parameters to see all photos.'
              : 'The gallery is currently empty. Click "Upload Photos (Batch)" to add your first batch of images.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Photos</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MULTI-IMAGE BATCH UPLOAD MODAL */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up my-6">
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-800/80 text-amber-300">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold leading-tight">
                    Batch Upload Photos to Gallery
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Upload multiple event photos, assign album details, and publish in one click.
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isProcessing && setShowModal(false)}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-full transition-colors"
                disabled={isProcessing}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBatch} className="p-6 space-y-5 text-xs">
              {/* Top Row: Album Title & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Album / Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    placeholder="e.g. 2025 Jihad Week Grand Opening & Lecture"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none bg-white font-medium"
                  />
                </div>
              </div>

              {/* Category & Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none bg-white font-medium"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Session</label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none bg-white font-medium"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} {s.isCurrent ? '(Current Active)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Common Caption */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  value={baseCaption}
                  onChange={(e) => setBaseCaption(e.target.value)}
                  placeholder="e.g. Cross-section of students and distinguished guest speakers at the auditorium."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none font-medium"
                />
              </div>

              {/* MULTI-IMAGE UPLOADER DROPZONE */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 text-sm">
                    Select Images to Upload{' '}
                    <span className="text-emerald-700 font-bold">
                      ({stagedPhotos.length} / {IMAGE_LIMITS.MAX_GALLERY_BATCH} selected)
                    </span>
                  </label>
                  {stagedPhotos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setStagedPhotos([])}
                      className="text-rose-600 hover:text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Clear All Staged
                    </button>
                  )}
                </div>

                {/* Drag and drop box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFilesSelected(e.dataTransfer.files);
                  }}
                  className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all ${
                    isDragging
                      ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]'
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="multi-gallery-upload-input"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />

                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <label
                        htmlFor="multi-gallery-upload-input"
                        className="inline-block px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                      >
                        Choose Multiple Photos
                      </label>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        or drag and drop photos directly here (JPEG, PNG, WEBP).
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Images are automatically compressed & optimized for high speed and mobile viewing.
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrl();
                      }
                    }}
                    placeholder="Or paste an image URL (https://...) and press Add"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 outline-none text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Add URL
                  </button>
                </div>

                {/* Staged Photos Preview Grid */}
                {stagedPhotos.length > 0 && (
                  <div className="space-y-2 pt-3">
                    <h5 className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ready to Upload ({stagedPhotos.length} photos)</span>
                    </h5>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 bg-slate-100 rounded-2xl border border-slate-200">
                      {stagedPhotos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className="relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col group"
                        >
                          <div className="relative h-24 bg-slate-900">
                            <img
                              src={photo.dataUrl}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveStagedPhoto(photo.id)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 shadow-xs transition-colors cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono font-bold">
                              #{index + 1}
                            </span>
                          </div>

                          <div className="p-1.5 space-y-1">
                            <input
                              type="text"
                              value={photo.caption}
                              onChange={(e) => handleUpdateStagedCaption(photo.id, e.target.value)}
                              placeholder={`Caption #${index + 1}`}
                              className="w-full px-1.5 py-0.5 text-[10px] rounded border border-slate-200 outline-none focus:border-emerald-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isProcessing || stagedPhotos.length === 0}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Optimizing & Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>
                        Save {stagedPhotos.length > 0 ? `${stagedPhotos.length} Photo(s)` : 'Photos'} to Gallery
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL-SIZE PREVIEW LIGHTBOX */}
      {/* ========================================================================= */}
      {previewItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white animate-scale-up">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-black/60 hover:bg-black rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="w-full h-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-800 text-amber-300 text-[10px] font-bold uppercase">
                    {previewItem.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Session: {previewItem.session}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {previewItem.title}
                </h3>
                {previewItem.caption && (
                  <p className="text-xs text-slate-300 max-w-xl">
                    {previewItem.caption}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => promptDeleteSingle(previewItem)}
                  className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-APP SINGLE DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Delete Gallery Photo?
                </h3>
                <p className="text-xs text-slate-500">
                  This action will permanently remove this photo from the media gallery.
                </p>
              </div>
            </div>

            {/* Thumbnail Preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={photoToDelete.imageUrl}
                alt={photoToDelete.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-extrabold text-slate-900 truncate">
                  {photoToDelete.title}
                </h4>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold">{photoToDelete.category}</span>
                  <span>•</span>
                  <span>{photoToDelete.session}</span>
                </div>
                {photoToDelete.date && (
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                    {photoToDelete.date}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteSingle}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IN-APP BULK DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Bulk Delete {selectedItemIds.length} Photos?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to permanently delete these {selectedItemIds.length} selected photos?
                </p>
              </div>
            </div>

            {/* Small Thumbnails strip */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
              {gallery
                .filter((item) => selectedItemIds.includes(item.id))
                .map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmBulkDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Deleting {selectedItemIds.length} photos...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete All {selectedItemIds.length}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
