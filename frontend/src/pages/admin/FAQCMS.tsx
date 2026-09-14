import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Save, Trash2, Edit2, Search } from 'lucide-react';
import { api } from '../../api/client.js';
import { FAQItem, FAQCategory, ContentStatus } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

const CATEGORIES: FAQCategory[] = [
  'About the Candidate',
  'Why She Is Contesting',
  "Role of the SRC Women's Commissioner",
  'Campaign Agenda',
  'How Policies Will Be Implemented',
  'How Students Can Participate',
  'How to Contact the Candidate'
];

export const FAQCMS: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<Partial<FAQItem> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteTargetItem, setDeleteTargetItem] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'FAQ & Knowledge Base CMS | Campaign Staff Portal';
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllFAQAdmin();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load FAQ items.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForCategory = (cat: FAQCategory) => {
    setEditingItem({
      category: cat,
      question: '',
      answer: '',
      sort_order: items.filter(i => i.category === cat).length + 1,
      status: 'published'
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.question?.trim() || !editingItem.answer?.trim()) {
      toast.error('Validation Error', 'Question and answer are required.');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const created = await api.createFAQ(editingItem);
        setItems([...items, created]);
        toast.success('Question Created', 'New Q&A added to FAQ knowledge base.');
      } else if (editingItem.id) {
        const updated = await api.updateFAQ(editingItem.id, editingItem);
        setItems(items.map(i => i.id === updated.id ? updated : i));
        toast.success('Question Saved', 'FAQ item updated successfully.');
      }
      setEditingItem(null);
      setIsCreating(false);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetItem) return;
    setDeleting(true);
    try {
      await api.deleteFAQ(deleteTargetItem.id);
      setItems(items.filter(i => i.id !== deleteTargetItem.id));
      toast.success('Question Removed', `"${deleteTargetItem.question}" removed from FAQ.`);
      setDeleteTargetItem(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete FAQ question.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading FAQ knowledge base..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load FAQ"
        message={error}
        onRetry={fetchFAQ}
      />
    );
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            FAQ & Answers Manager
          </h1>
          <p className="text-xs text-ink/65">
            Manage responses to student queries across 7 official campaign categories.
          </p>
        </div>

        {!editingItem && (
          <button
            onClick={() => handleCreateForCategory(CATEGORIES[0])}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        )}
      </div>

      {editingItem ? (
        <form onSubmit={handleSave} className="campaign-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-brand-navy">
              {isCreating ? 'Add New Question' : 'Edit Question & Answer'}
            </h2>
            <button
              type="button"
              onClick={() => { setEditingItem(null); setIsCreating(false); }}
              className="text-xs text-ink/60 font-semibold hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Category *</label>
              <select
                value={editingItem.category || CATEGORIES[0]}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as FAQCategory })}
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Status</label>
              <select
                value={editingItem.status || 'published'}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as ContentStatus })}
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Question *</label>
              <input
                type="text"
                required
                value={editingItem.question || ''}
                onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                placeholder="e.g. How does the candidate plan to engage students across non-residential hostels?"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Answer *</label>
              <textarea
                required
                rows={4}
                value={editingItem.answer || ''}
                onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                placeholder="Comprehensive, clear answer for students..."
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setEditingItem(null); setIsCreating(false); }}
              disabled={saving}
              className="px-3 py-1.5 text-xs text-ink/60 hover:text-ink transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2 px-5 gap-2 flex items-center"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Question'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQ questions and answers..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>
          </div>

          {CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter(i => i.category === cat);
            if (searchQuery.trim() && catItems.length === 0) return null;
            return (
              <div key={cat} className="campaign-card">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                    {cat} ({catItems.length})
                  </h3>
                  <button
                    onClick={() => handleCreateForCategory(cat)}
                    className="text-xs font-bold text-brand-navy hover:text-brand-gold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {catItems.length === 0 ? (
                  <p className="text-xs text-ink/40 py-2">No questions added for this category yet.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {catItems.map((item) => (
                      <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="font-bold text-xs text-brand-navy block">
                            {item.question}
                          </span>
                          <p className="text-xs text-ink/70 line-clamp-2">
                            {item.answer}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => { setEditingItem(item); setIsCreating(false); }}
                            className="p-1.5 rounded hover:bg-muted text-brand-navy transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetItem(item)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm Modal with Specific Question */}
      <ConfirmModal
        isOpen={!!deleteTargetItem}
        title="Delete FAQ Question"
        message={`Are you sure you want to remove the question "${deleteTargetItem?.question}" from the knowledge base?`}
        confirmText="Delete Question"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetItem(null)}
      />
    </div>
  );
};
