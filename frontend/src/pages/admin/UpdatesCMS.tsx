import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Save, Trash2, Edit2, ArrowLeft, CheckCircle2, AlertCircle, Calendar, Eye } from 'lucide-react';
import { api } from '../../api/client.js';
import { CampaignUpdate, UpdateCategory, ContentStatus } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

const CATEGORIES: { label: string; value: UpdateCategory }[] = [
  { label: 'News', value: 'news' },
  { label: 'Engagement', value: 'engagement' },
  { label: 'Policy Update', value: 'policy_update' },
  { label: 'Speech', value: 'speech' },
  { label: 'Media Feature', value: 'media_feature' },
  { label: 'Milestone', value: 'milestone' }
];

export const UpdatesCMS: React.FC = () => {
  const toast = useToast();
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPost, setEditingPost] = useState<Partial<CampaignUpdate> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const data = await api.getAllUpdatesAdmin();
      setUpdates(data);
    } catch (err: any) {
      toast.error('Fetch Failed', err.message || 'Failed to fetch updates.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingPost({
      title: '',
      slug: '',
      category: 'news',
      excerpt: '',
      body: '',
      cover_image_url: '',
      status: 'draft'
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title || !editingPost.body) {
      toast.error('Validation Error', 'Title and body are required.');
      return;
    }
    setSaving(true);

    const slug = editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const excerpt = editingPost.excerpt && editingPost.excerpt.trim().length >= 5
      ? editingPost.excerpt.trim()
      : editingPost.body.slice(0, 140) + '...';

    try {
      if (isCreating) {
        const created = await api.createUpdate({
          ...editingPost,
          slug,
          excerpt
        });
        setUpdates([created, ...updates]);
        toast.success('Dispatch Created', `Update "${created.title}" successfully created.`);
      } else if (editingPost.id) {
        const updated = await api.updateUpdate(editingPost.id, {
          ...editingPost,
          slug,
          excerpt
        });
        setUpdates(updates.map(u => u.id === updated.id ? updated : u));
        toast.success('Dispatch Saved', `Update "${updated.title}" successfully updated.`);
      }
      setEditingPost(null);
      setIsCreating(false);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save update.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.deleteUpdate(deleteTargetId);
      setUpdates(updates.filter(u => u.id !== deleteTargetId));
      toast.success('Update Deleted', 'Campaign dispatch has been permanently removed.');
      setDeleteTargetId(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete update.');
    } finally {
      setDeleting(false);
    }
  };


  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return <span className="badge-published">Published</span>;
      case 'approved':
        return <span className="badge-approved">Approved</span>;
      case 'in_review':
        return <span className="badge-review">In Review</span>;
      case 'draft':
        return <span className="badge-draft">Draft</span>;
      case 'archived':
        return <span className="badge-archived">Archived</span>;
    }
  };

  if (loading) {
    return <LoadingState message="Loading campaign dispatches..." />;
  }

  const filteredUpdates = updates.filter(u => statusFilter === 'all' || u.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Communications Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Campaign Updates & Dispatches
          </h1>
          <p className="text-xs text-ink/65">
            Draft, review, approve, and publish news articles and announcements for students.
          </p>
        </div>

        {!editingPost && (
          <button
            onClick={handleCreateNew}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Dispatch</span>
          </button>
        )}
      </div>

      {editingPost ? (
        <form onSubmit={handleSave} className="space-y-6">

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => { setEditingPost(null); setIsCreating(false); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-gold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Updates List</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (70%) */}
            <div className="lg:col-span-8 campaign-card space-y-5">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setEditingPost({ ...editingPost, title, slug: isCreating ? autoSlug : editingPost.slug });
                  }}
                  placeholder="e.g. Campaign Team Meets with Hall Executives to Discuss Security"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm font-bold focus:border-brand-gold bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    Category Tag *
                  </label>
                  <select
                    value={editingPost.category || 'news'}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as UpdateCategory })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm font-mono text-xs focus:border-brand-gold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  One-Line Excerpt (Appears in Card Feed)
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Brief summary for social cards and feed listing..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Full Article Body (Markdown / Text) *
                </label>
                <textarea
                  required
                  rows={10}
                  value={editingPost.body || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                  placeholder="Write the full report, remarks, or press dispatch..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-normal leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Right Column (30%) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="campaign-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-2">
                  Publication Workflow
                </h3>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    Current Status
                  </label>
                  <select
                    value={editingPost.status || 'draft'}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as ContentStatus })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm font-semibold focus:border-brand-gold bg-white"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="in_review">In Review (Editorial Check)</option>
                    <option value="approved">Approved (Ready)</option>
                    <option value="published">Published (Live to Students)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    Cover Photo URL
                  </label>
                  <input
                    type="text"
                    value={editingPost.cover_image_url || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, cover_image_url: e.target.value })}
                    placeholder="https://.../photo.jpg"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-xs font-mono focus:border-brand-gold bg-white"
                  />
                  <p className="text-[11px] text-ink/50 mt-1">
                    Leave blank for default brand thumbnail.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-gold w-full text-xs font-bold py-3 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save & Update Dispatch'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="campaign-card !p-0 overflow-hidden">
          {/* Filter Bar */}

          <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink/70">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-white"
              >
                <option value="all">All Statuses ({updates.length})</option>
                <option value="published">Published</option>
                <option value="approved">Approved</option>
                <option value="in_review">In Review</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-ink/60 uppercase font-bold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUpdates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-ink/50">
                      No updates found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredUpdates.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 max-w-md">
                        <span className="font-bold text-brand-navy block truncate">
                          {post.title}
                        </span>
                        <span className="text-[11px] text-ink/50 font-mono truncate block">
                          /{post.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-muted px-2.5 py-1 rounded font-semibold text-brand-navyDark uppercase text-[10px]">
                          {post.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="py-3 px-4 text-ink/60 whitespace-nowrap">
                        {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setEditingPost(post); setIsCreating(false); }}
                            className="p-1.5 rounded hover:bg-muted text-brand-navy"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(post.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reusable Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Campaign Dispatch"
        message="Are you sure you want to delete this campaign dispatch? This action cannot be undone."
        confirmText="Delete Dispatch"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

