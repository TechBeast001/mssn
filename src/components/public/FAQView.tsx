import React, { useState } from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { PublicTab } from '../layout/Navbar';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface FAQViewProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenRegistration: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({
  onTabChange,
  onOpenRegistration
}) => {
  const { faqs } = useMSSNStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true
  });

  const categories = ['all', 'Membership & e-ID', 'Academic Support', 'Committees & Volunteering', 'Welfare & Donations'];

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQ = faq.question.toLowerCase().includes(q);
      const matchA = faq.answer.toLowerCase().includes(q);
      if (!matchQ && !matchA) return false;
    }
    return true;
  });

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          Common Questions & Guidance
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Find instant answers regarding membership registration, e-ID cards, academic tutorials, and welfare assistance at MSSN FUD.
        </p>
      </div>

      {/* Search & Category Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
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
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List Accordion */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    ?
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </span>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  <p>{faq.answer}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Category: {faq.category}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500">
          <p className="font-bold text-slate-700">No matching questions found.</p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-emerald-900 text-white text-center space-y-4 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          Still Have Questions or Need Personal Assistance?
        </h3>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
          Contact our secretariat directly or visit us at the Central Mosque Complex after daily Zuhr prayers.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onTabChange('contact')}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            Contact Secretariat
          </button>
          <button
            onClick={onOpenRegistration}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs border border-emerald-600 transition-all cursor-pointer"
          >
            Register as Member
          </button>
        </div>
      </div>
    </div>
  );
};
