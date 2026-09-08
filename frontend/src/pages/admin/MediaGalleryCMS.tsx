import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Save, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { api } from '../../api/client.js';
import { MediaItem } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

export const MediaGalleryCMS: React.FC = () => {
  const toast = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<{ url: string; caption: string; alt_text: string }>({
    url: '',
    caption: '',
    alt_text: ''
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMedia();
      setMedia(data);
    } catch (err: any) {
      toast.error('Fetch Failed', err.message || 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.url || !newItem.alt_text.trim()) {
      toast.error('Accessibility Requirement', 'Alt text is strictly mandatory for screen readers.');
      return;
    }

    setUploading(true);

    try {
      const created = await api.createMedia({
        media_type: 'photo',
        url: newItem.url.trim(),
        caption: newItem.caption.trim() || undefined,
        alt_text: newItem.alt_text.trim(),
        sort_order: media.length + 1
      });
      setMedia([...media, created]);
      setIsAdding(false);
      setNewItem({ url: '', caption: '', alt_text: '' });
      toast.success('Media Uploaded', 'New photo added to campaign gallery.');
    } catch (err: any) {
      toast.error('Upload Failed', err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.deleteMedia(deleteTargetId);
      setMedia(media.filter(m => m.id !== deleteTargetId));
      toast.success('Media Deleted', 'Photo has been removed from gallery.');
      setDeleteTargetId(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };


  if (loading) {
    return <LoadingState message="Loading media gallery..." />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Creative Assets</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Media Gallery & Visuals
          </h1>
          <p className="text-xs text-ink/65">
            Manage campaign photos with mandatory WCAG accessibility alt-text enforcement.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddMedia} className="campaign-card space-y-4">

          <h2 className="text-base font-bold text-brand-navy border-b border-border pb-3">
            Add New Media Asset
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Image CDN URL (Cloudinary / S3) *
              </label>
              <input
                type="url"
                required
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="https://res.cloudinary.com/.../photo.jpg"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Caption (Optional)
              </label>
              <input
                type="text"
                value={newItem.caption}
                onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                placeholder="e.g. Townhall at LBC Auditorium with Level 200 students"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1 flex items-center gap-1.5">
                <span>Accessibility Alt-Text (Mandatory per Spec §7.1)</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newItem.alt_text}
                onChange={(e) => setNewItem({ ...newItem, alt_text: e.target.value })}
                placeholder="Describe the image content for screen readers (e.g. Candidate addressing a full hall of female students)"
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-ink/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn-gold text-xs font-bold py-2 px-6 gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{uploading ? 'Adding...' : 'Save to Gallery'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="campaign-card !p-0 overflow-hidden group relative">
            <div className="w-full h-48 bg-brand-navyDark relative overflow-hidden flex items-center justify-center">
              <img
                src={item.url}
                alt={item.alt_text}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <button
                onClick={() => setDeleteTargetId(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-brand-navyDark/80 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <span className="text-xs font-bold text-brand-navy block truncate">
                {item.caption || 'Campaign Photo'}
              </span>
              <span className="text-[10px] text-ink/50 block truncate mt-0.5" title={item.alt_text}>
                Alt: {item.alt_text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reusable Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Photo"
        message="Are you sure you want to delete this photo from the media gallery? This cannot be undone."
        confirmText="Delete Photo"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

