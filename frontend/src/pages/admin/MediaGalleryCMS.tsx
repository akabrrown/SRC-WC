import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Plus, Trash2, Save, Upload, Cloud, X } from 'lucide-react';
import { api } from '../../api/client.js';
import { MediaItem } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';
import { uploadToCloudinary } from '../../utils/cloudinary.js';

export const MediaGalleryCMS: React.FC = () => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [newItem, setNewItem] = useState<{ url: string; caption: string; alt_text: string }>({
    url: '',
    caption: '',
    alt_text: ''
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deleteTargetMedia, setDeleteTargetMedia] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Media Gallery CMS | Campaign Staff Portal';
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMedia();
      setMedia(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load media items.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File', 'Please select an image file (JPG, PNG, WebP).');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.alt_text.trim()) {
      toast.error('Accessibility Requirement', 'Alt text is strictly mandatory for screen readers.');
      return;
    }

    if (!selectedFile && !newItem.url.trim()) {
      toast.error('Missing Media', 'Please select an image to upload or enter a direct CDN URL.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let finalUrl = newItem.url.trim();

      if (selectedFile) {
        finalUrl = await uploadToCloudinary(selectedFile, (progress) => {
          setUploadProgress(progress);
        });
      }

      const created = await api.createMedia({
        media_type: 'photo',
        url: finalUrl,
        caption: newItem.caption.trim() || undefined,
        alt_text: newItem.alt_text.trim(),
        sort_order: media.length + 1
      });

      setMedia([...media, created]);
      setIsAdding(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setNewItem({ url: '', caption: '', alt_text: '' });
      toast.success('Media Uploaded', 'New photo uploaded and published to gallery.');
    } catch (err: any) {
      toast.error('Upload Failed', err.message || 'Failed to process media upload.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetMedia) return;
    setDeleting(true);
    try {
      await api.deleteMedia(deleteTargetMedia.id);
      setMedia(media.filter(m => m.id !== deleteTargetMedia.id));
      toast.success('Media Deleted', `Photo "${deleteTargetMedia.caption || deleteTargetMedia.alt_text}" removed from gallery.`);
      setDeleteTargetMedia(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete photo.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading media gallery..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Media"
        message={error}
        onRetry={fetchMedia}
      />
    );
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
            Upload campaign photos to Cloudinary CDN with mandatory WCAG accessibility alt-text enforcement.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddMedia} className="campaign-card space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
              <Cloud className="w-4 h-4 text-brand-gold" />
              <span>Upload New Photo Asset (Cloudinary CDN)</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setSelectedFile(null);
                setPreviewUrl('');
              }}
              className="text-ink/40 hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Upload / Drag & Drop area */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">
                Upload Image File (Direct to Cloudinary)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  previewUrl ? 'border-brand-gold bg-brand-gold/5' : 'border-border hover:border-brand-gold bg-surface/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="h-36 max-w-full object-cover rounded-lg border border-border shadow-sm"
                    />
                    <p className="text-xs text-brand-navy font-semibold">
                      {selectedFile?.name} ({(Number(selectedFile?.size || 0) / 1024).toFixed(1)} KB) — Click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-brand-navy">
                      Click to choose an image file from your device
                    </span>
                    <span className="text-[11px] text-ink/50">
                      Supports JPG, PNG, WebP up to 10MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Direct URL override */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink mb-1">
                Or Paste Existing Image URL
              </label>
              <input
                type="url"
                value={newItem.url}
                onChange={(e) => {
                  setNewItem({ ...newItem, url: e.target.value });
                  if (e.target.value) {
                    setPreviewUrl(e.target.value);
                    setSelectedFile(null);
                  }
                }}
                placeholder="https://res.cloudinary.com/.../image/upload/..."
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
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
                <span>Accessibility Alt-Text (Mandatory per WCAG Standards)</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newItem.alt_text}
                onChange={(e) => setNewItem({ ...newItem, alt_text: e.target.value })}
                placeholder="Describe what is happening in the photo for screen readers..."
                className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white font-medium"
              />
            </div>
          </div>

          {uploading && uploadProgress > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-brand-navy font-semibold">
                <span>Uploading to Cloudinary CDN...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-gold h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setSelectedFile(null);
                setPreviewUrl('');
              }}
              disabled={uploading}
              className="px-4 py-2 text-xs text-ink/60 hover:text-ink transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn-gold text-xs font-bold py-2 px-6 gap-2 shadow-sm flex items-center"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Save to Gallery'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Media Grid */}
      {media.length === 0 ? (
        <EmptyState
          title="No Photos in Gallery"
          message="Upload campaign photos to populate the public media gallery."
          actionText="Upload Photo"
          onAction={() => setIsAdding(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="campaign-card !p-0 overflow-hidden group relative">
              <div className="w-full h-48 bg-brand-navyDark relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.alt_text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                <button
                  onClick={() => setDeleteTargetMedia(item)}
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
      )}

      {/* Reusable Confirm Modal with Named Item */}
      <ConfirmModal
        isOpen={!!deleteTargetMedia}
        title="Delete Photo"
        message={`Are you sure you want to delete the photo "${deleteTargetMedia?.caption || deleteTargetMedia?.alt_text || 'selected photo'}" from the media gallery? This cannot be undone.`}
        confirmText="Delete Photo"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetMedia(null)}
      />
    </div>
  );
};
