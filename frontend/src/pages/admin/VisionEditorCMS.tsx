import React, { useState, useEffect } from 'react';
import { Eye, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { VisionContent, CampaignValue, LeadershipPromise } from '../../types/index.js';
import { LoadingState, ErrorState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';

export const VisionEditorCMS: React.FC = () => {
  const toast = useToast();
  const [vision, setVision] = useState<VisionContent | null>(null);
  const [values, setValues] = useState<CampaignValue[]>([]);
  const [promises, setPromises] = useState<LeadershipPromise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Vision & Values CMS | Campaign Staff Portal';
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vis, val, prom] = await Promise.all([
        api.getVision(),
        api.getValues(),
        api.getPromises()
      ]);
      setVision(vis);
      setValues(val);
      setPromises(prom);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vision and values.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vision) return;

    if (!vision.vision_statement.trim() || !vision.mission_statement.trim()) {
      toast.error('Validation Error', 'Both Vision and Mission statements are required.');
      return;
    }

    setSaving(true);
    try {
      const [updatedVision, updatedValues] = await Promise.all([
        api.updateVision({
          ...vision,
          vision_statement: vision.vision_statement.trim(),
          mission_statement: vision.mission_statement.trim()
        }),
        api.updateValues(values)
      ]);
      setVision(updatedVision);
      setValues(updatedValues);
      setEditingValueIndex(null);
      toast.success('Vision & Values Saved', 'Foundational statements and campaign values updated live.');
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save vision content.');
    } finally {
      setSaving(false);
    }
  };

  const handleValueChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    setValues(updated);
  };

  if (loading) {
    return <LoadingState message="Loading vision & values editor..." />;
  }

  if (error || !vision) {
    return (
      <ErrorState
        title="Failed to Load Vision Content"
        message={error || 'Could not retrieve vision and philosophy records.'}
        onRetry={fetchData}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span>Foundational Philosophy</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Vision, Mission & Values
          </h1>
          <p className="text-xs text-ink/65">
            Configure the official vision statement, mission, and core campaign values displayed on Meet Candidate.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Vision & Mission Statements */}
        <div className="campaign-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-3 mb-5">
            1. Editorial Vision & Mission Statements
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">
                  Vision Statement (Editorial Pull-Quote) *
                </label>
                {vision.is_placeholder && (
                  <span className="placeholder-badge text-[10px]">Draft Pending Approval</span>
                )}
              </div>
              <textarea
                rows={4}
                required
                value={vision.vision_statement}
                onChange={(e) => setVision({ ...vision, vision_statement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white leading-relaxed resize-none font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">
                  Mission Statement (Supporting Paragraph) *
                </label>
              </div>
              <textarea
                rows={4}
                required
                value={vision.mission_statement}
                onChange={(e) => setVision({ ...vision, mission_statement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="campaign-card">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy">
              2. Core Campaign Values ({values.length})
            </h2>
            <span className="text-[11px] text-ink/50">Displayed in 2-Column Grid on Public Site</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, index) => (
              <div key={v.id || index} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-brand-navy uppercase mb-1">
                    Value {index + 1} Title
                  </label>
                  <input
                    type="text"
                    value={v.title}
                    onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-border text-xs font-bold text-brand-navy bg-white focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-ink/60 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={v.description}
                    onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-border text-xs text-ink/80 bg-white focus:border-brand-gold resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Promises */}
        <div className="campaign-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-3 mb-5">
            3. Leadership Promises (3 Pillars)
          </h2>

          <div className="space-y-4">
            {promises.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-border flex items-start gap-4 bg-muted/20">
                <div className="w-9 h-9 rounded-lg bg-brand-navy text-brand-gold font-extrabold flex items-center justify-center text-base flex-shrink-0">
                  {p.promise_number}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-navy mb-1">{p.title}</h3>
                  <p className="text-xs text-ink/70 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-4 z-20 p-4 rounded-xl bg-brand-navyDark text-white shadow-2xl flex items-center justify-between border border-white/20">
          <div className="text-xs text-white/70">
            Changes reflect immediately on public website.
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-gold text-xs font-bold py-2.5 px-6 gap-2 flex items-center"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Statements & Values'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
