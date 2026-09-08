import React, { useState, useEffect } from 'react';
import { Quote, Plus, Save, Trash2, Edit2, CheckCircle, AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { api } from '../../api/client.js';
import { Testimonial, ContentStatus } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

export const TestimonialsCMS: React.FC = () => {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await api.getAllTestimonialsAdmin();
      setTestimonials(data);
    } catch (err: any) {
      toast.error('Fetch Failed', err.message || 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingItem({
      name: '',
      programme_role: '',
      statement: '',
      photo_url: '',
      video_url: '',
      consent_confirmed: false,
      status: 'draft'
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.statement) {
      toast.error('Validation Error', 'Name and statement are required.');
      return;
    }

    if (editingItem.status === 'published' && !editingItem.consent_confirmed) {
      toast.error('Consent Gate Violation', 'Consent must be confirmed before publishing a testimonial.');
      return;
    }

    setSaving(true);

    try {
      if (isCreating) {
        const created = await api.createTestimonial(editingItem);
        setTestimonials([...testimonials, created]);
        toast.success('Testimonial Created', `Endorsement for "${created.name}" created.`);
      } else if (editingItem.id) {
        const updated = await api.updateTestimonial(editingItem.id, editingItem);
        setTestimonials(testimonials.map(t => t.id === updated.id ? updated : t));
        toast.success('Testimonial Saved', `Endorsement for "${updated.name}" updated.`);
      }
      setEditingItem(null);
      setIsCreating(false);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.deleteTestimonial(deleteTargetId);
      setTestimonials(testimonials.filter(t => t.id !== deleteTargetId));
      toast.success('Testimonial Removed', 'Endorsement has been deleted.');
      setDeleteTargetId(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };


  if (loading) {
    return <LoadingState message="Loading endorsements and consent records..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Quote className="w-3.5 h-3.5" />
            <span>Social Proof & Governance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Voices of Support / Testimonials
          </h1>
          <p className="text-xs text-ink/65">
            Manage peer endorsements with strict database-level student consent verification.
          </p>
        </div>

        {!editingItem && (
          <button
            onClick={handleCreateNew}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Endorsement</span>
          </button>
        )}
      </div>

      {editingItem ? (
        <form onSubmit={handleSave} className="campaign-card space-y-5">

          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-brand-navy">
              {isCreating ? 'Record New Student Endorsement' : 'Edit Endorsement'}
            </h2>
            <button
              type="button"
              onClick={() => { setEditingItem(null); setIsCreating(false); }}
              className="text-xs text-ink/60 hover:text-ink font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Endorser Name *</label>
              <input
                type="text"
                required
                value={editingItem.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="e.g. Priscilla Antwi"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Programme / Campus Role *</label>
              <input
                type="text"
                required
                value={editingItem.programme_role || ''}
                onChange={(e) => setEditingItem({ ...editingItem, programme_role: e.target.value })}
                placeholder="e.g. BSc IT, Level 300 · Hall President"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">Endorsement Statement / Quote *</label>
              <textarea
                required
                rows={4}
                value={editingItem.statement || ''}
                onChange={(e) => setEditingItem({ ...editingItem, statement: e.target.value })}
                placeholder="Why is this candidate the ideal choice for Women's Commissioner?"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Photo URL</label>
              <input
                type="text"
                value={editingItem.photo_url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, photo_url: e.target.value })}
                placeholder="https://.../photo.jpg"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Video Testimonial URL (Optional)</label>
              <input
                type="text"
                value={editingItem.video_url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, video_url: e.target.value })}
                placeholder="https://.../video.mp4"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            {/* MANDATORY CONSENT GATE */}
            <div className="sm:col-span-2 p-4 rounded-xl bg-amber-50/70 border border-amber-300">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent_check"
                  checked={!!editingItem.consent_confirmed}
                  onChange={(e) => setEditingItem({ ...editingItem, consent_confirmed: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
                />
                <label htmlFor="consent_check" className="text-xs text-amber-950">
                  <strong className="block font-bold">Mandatory Student Consent Gate (Spec §5.3 & §7.3)</strong>
                  I certify that explicit verbal/written consent has been granted by this student for their quote, name, and likeness to be published on the campaign platform.
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Publication Status</label>
              <select
                value={editingItem.status || 'draft'}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as ContentStatus })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              >
                <option value="draft">Draft (Private)</option>
                <option value="in_review">In Review</option>
                <option value="published" disabled={!editingItem.consent_confirmed}>
                  {editingItem.consent_confirmed ? 'Published (Live)' : 'Published (Disabled - Consent Required)'}
                </option>
                <option value="archived">Archived</option>
              </select>
              {!editingItem.consent_confirmed && (
                <p className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Consent must be checked to enable publishing.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { setEditingItem(null); setIsCreating(false); }}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink/70 hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || (editingItem.status === 'published' && !editingItem.consent_confirmed)}
              className="btn-gold text-xs font-bold py-2.5 px-6 gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Endorsement'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="campaign-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.consent_confirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {t.consent_confirmed ? 'Consent Confirmed' : 'Awaiting Consent'}
                  </span>
                  <span className="badge-published">{t.status}</span>
                </div>

                <blockquote className="text-xs text-ink/80 italic mb-4 leading-relaxed">
                  "{t.statement}"
                </blockquote>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-brand-navy">{t.name}</h4>
                  <p className="text-[10px] text-ink/50">{t.programme_role}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setEditingItem(t); setIsCreating(false); }}
                    className="p-1.5 rounded hover:bg-muted text-brand-navy"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(t.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this student endorsement? This cannot be undone."
        confirmText="Delete Endorsement"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

