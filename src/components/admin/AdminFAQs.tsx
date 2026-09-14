import React, { useState, useMemo } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { FAQItem } from '../../types';
import {
  HelpCircle,
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  Sparkles,
  Layers,
  Save,
  MessageSquare
} from 'lucide-react';

export const AdminFAQs: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useMSSNStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);

  // Form data
  const [formData, setFormData] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
    category: 'General'
  });

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FAQItem | null>(null);

  const categories = [
    'General',
    'Registration & e-ID',
    'Academics & Jihad Week',
    'Sadaqah & Welfare',
    "Sister's Wing",
    'Secretariat & Elections'
  ];

  const filteredFAQs = useMemo(() => {
    return faqs.filter((f) => {
      const matchSearch =
        searchQuery === '' ||
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'all' || f.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [faqs, searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingFAQ(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQItem) => {
    setEditingFAQ(faq);
    setFormData(faq);
    setModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;

    if (editingFAQ) {
      updateFAQ({
        ...editingFAQ,
        question: formData.question || '',
        answer: formData.answer || '',
        category: formData.category || 'General',
        order: editingFAQ.order || 1
      });
    } else {
      addFAQ({
        question: formData.question || '',
        answer: formData.answer || '',
        category: formData.category || 'General',
        order: faqs.length + 1
      });
    }
    setModalOpen(false);
  };

  const handleConfirmDelete = (faq: FAQItem) => {
    setItemToDelete(faq);
    setDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (itemToDelete) {
      deleteFAQ(itemToDelete.id);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-800">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              FAQ & Student Help Center CMS
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage official frequently asked questions, guidelines on membership e-IDs, Jihad Week participation, and university Islamic affairs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 outline-none"
        >
          <option value="all">All FAQ Categories ({faqs.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-800">No FAQs Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No questions matched your query. Click below to add a new frequently asked question.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Add First FAQ
            </button>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                      Q{index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-bold">
                      {faq.category || 'General'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm pl-8">
                    {faq.question}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-2 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800 rounded-xl cursor-pointer transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleConfirmDelete(faq)}
                    className="p-2 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 rounded-xl cursor-pointer transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pl-8 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>{editingFAQ ? 'Edit FAQ Item' : 'Create New FAQ Item'}</span>
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
                  Category *
                </label>
                <select
                  required
                  value={formData.category || 'General'}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="e.g. How do I download my official MSSN FUD digital membership ID card?"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Detailed Answer / Solution *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Provide a clear, helpful explanation for student members..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
                  {editingFAQ ? 'Save Changes' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">
                Delete FAQ Item
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete the question "{itemToDelete?.question}"? It will be removed from the public FAQ list.
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
                Yes, Delete FAQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
