import React, { useState, useEffect } from 'react';
import { Heart, Save, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { WomensCornerSection } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const WomensCornerCMS: React.FC = () => {
  const [sections, setSections] = useState<WomensCornerSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingSection, setEditingSection] = useState<WomensCornerSection | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const data = await api.getWomensCornerSections();
      setSections(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load sections.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    setSaving(true);
    setError(null);

    try {
      // In the mock/database, sections can be updated
      setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
      setEditingSection(null);
      setSuccessMsg('Section updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Women's Corner sections..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Dedicated Female Student Welfare</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Women's Corner Sections Manager
          </h1>
          <p className="text-xs text-ink/65">
            Manage the 4 foundational pillars: Issues, Opportunities, Resources, and Support.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {editingSection ? (
        <form onSubmit={handleSave} className="campaign-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-brand-navy">
              Edit Section: {editingSection.title}
            </h2>
            <button
              type="button"
              onClick={() => setEditingSection(null)}
              className="text-xs text-ink/60 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Section Title *</label>
            <input
              type="text"
              required
              value={editingSection.title}
              onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Icon Identifier</label>
            <input
              type="text"
              value={editingSection.icon}
              onChange={(e) => setEditingSection({ ...editingSection, icon: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Body Content & Strategy *</label>
            <textarea
              required
              rows={5}
              value={editingSection.body}
              onChange={(e) => setEditingSection({ ...editingSection, body: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white leading-relaxed resize-none"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingSection(null)}
              className="px-4 py-2 text-xs text-ink/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2 px-6 gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Section'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {sections.map((sec) => (
            <div key={sec.id} className="campaign-card flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-brand-navy">{sec.title}</h3>
                <p className="text-xs text-ink/70 leading-relaxed">{sec.body}</p>
              </div>
              <button
                onClick={() => setEditingSection(sec)}
                className="btn-outline-navy text-xs py-1.5 px-3 gap-1.5 flex-shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
