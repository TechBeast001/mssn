import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { Article } from '../../types';
import { BookOpen, Plus, Edit2, Trash2, X, Save, Clock, User } from 'lucide-react';

export const AdminBlog: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle, adminUser } = useMSSNStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // Form
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<string>('Academic Excellence');
  const [author, setAuthor] = useState<string>(adminUser?.fullName || 'MSSN Editorial Board');
  const [authorRole, setAuthorRole] = useState<string>('Executive Council');
  const [coverImage, setCoverImage] = useState<string>(
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
  );
  const [readTime, setReadTime] = useState<string>('4 min read');
  const [tagsInput, setTagsInput] = useState<string>('Academics, CGPA, FUD');

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('Academic Excellence');
    setAuthor(adminUser?.fullName || 'MSSN FUD Editorial Team');
    setAuthorRole('Executive Council');
    setCoverImage(
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
    );
    setReadTime('4 min read');
    setTagsInput('Academics, FUD, StudyGuide');
    setShowModal(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSummary(art.summary);
    setContent(art.content);
    setCategory(art.category);
    setAuthor(art.author);
    setAuthorRole(art.authorRole || '');
    setCoverImage(art.coverImage);
    setReadTime(art.readTime);
    setTagsInput(art.tags ? art.tags.join(', ') : '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        author: author.trim(),
        authorRole: authorRole.trim() || undefined,
        coverImage: coverImage.trim(),
        readTime,
        tags
      });
    } else {
      addArticle({
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        author: author.trim(),
        authorRole: authorRole.trim() || undefined,
        publishedAt: new Date().toISOString().split('T')[0],
        coverImage: coverImage.trim(),
        readTime,
        tags
      });
    }

    setShowModal(false);
  };

  const handleDelete = (art: Article) => {
    setArticleToDelete(art);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      deleteArticle(articleToDelete.id);
      setArticleToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Blog & Publications Editor
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish academic tutorials, spiritual reflections, and campus news.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative h-44 bg-slate-100">
              <img
                src={art.coverImage}
                alt={art.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold uppercase backdrop-blur-xs">
                {art.category}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">
                  {art.publishedAt} • {art.readTime}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 mt-1">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                  {art.author}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(art)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold">
                {editingArticle ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none bg-white"
                  >
                    <option value="Spiritual & Tarbiyyah">Spiritual & Tarbiyyah</option>
                    <option value="Academic Excellence">Academic Excellence</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Sisters' Corner">Sisters' Corner</option>
                    <option value="Islamic Jurisprudence">Islamic Jurisprudence</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Portfolio / Role</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Article Content *</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none font-normal leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Article Delete Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Delete Article?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to delete this publication? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-extrabold text-slate-900">
                {articleToDelete.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                By {articleToDelete.author} • {articleToDelete.category}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
