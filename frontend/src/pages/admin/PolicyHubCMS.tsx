import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Save, Trash2, Edit2, Lock, Settings as SettingsIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { PolicyItem, SiteSettings, ContentStatus } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const PolicyHubCMS: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPolicy, setEditingPolicy] = useState<Partial<PolicyItem> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sett, pols] = await Promise.all([
        api.getSiteSettings(),
        api.getAllPoliciesAdmin()
      ]);
      setSettings(sett);
      setPolicies(pols);
    } catch (err: any) {
      setError(err.message || 'Failed to load policy hub.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingPolicy({
      title: '',
      summary: '',
      issue_statement: '',
      solution: '',
      why_it_matters: '',
      implementation_plan: '',
      timeline: 'Semester 1 - 2',
      partners: 'SRC Executive, Hall Portresses, Dean of Students',
      cost_notes: 'Budgeted within SRC Welfare Allocation',
      beneficiaries: 'All undergraduate and postgraduate women',
      success_indicators: 'Quarterly review & student satisfaction poll',
      status: 'draft'
    });
    setIsCreating(true);
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPolicy || !editingPolicy.title) return;
    setSaving(true);
    setError(null);

    try {
      if (isCreating) {
        const created = await api.createPolicy(editingPolicy);
        setPolicies([created, ...policies]);
        setSuccessMsg('Policy platform item created successfully.');
      } else if (editingPolicy.id) {
        const updated = await api.updatePolicy(editingPolicy.id, editingPolicy);
        setPolicies(policies.map(p => p.id === updated.id ? updated : p));
        setSuccessMsg('Policy platform item updated successfully.');
      }
      setEditingPolicy(null);
      setIsCreating(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save policy item.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading policy platform data..." />;
  }

  const isTeaserMode = settings?.agenda_teaser_mode;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Policy Platform</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Our Agenda & Policy Hub CMS
          </h1>
          <p className="text-xs text-ink/65">
            Manage the five-pillar policy architecture and official policy platform dispatches.
          </p>
        </div>

        {!isTeaserMode && !editingPolicy && (
          <button
            onClick={handleCreateNew}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Policy Commitment</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Teaser Mode Lockout State */}
      {isTeaserMode ? (
        <div className="campaign-card border-amber-300 bg-amber-50/40 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy">
            Policy Platform Locked in Teaser Mode
          </h2>
          <p className="text-xs sm:text-sm text-ink/75 leading-relaxed">
            Per Technical Specification §8.3, individual policy items stay locked and hidden while <strong>Agenda Teaser Mode</strong> is active. The public website currently serves the high-impact teaser experience with the Needs Survey.
          </p>
          <div className="pt-2">
            <a
              href="/admin/launch-settings"
              className="btn-navy text-xs py-2.5 px-6 inline-flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4 text-brand-gold" />
              <span>Go to Launch Settings to Enable Platform Reveal</span>
            </a>
          </div>
        </div>
      ) : editingPolicy ? (
        /* Policy Editor View */
        <form onSubmit={handleSavePolicy} className="campaign-card space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-base font-bold text-brand-navy">
              {isCreating ? 'Create New Policy Commitment' : 'Edit Policy Platform Item'}
            </h2>
            <button
              type="button"
              onClick={() => { setEditingPolicy(null); setIsCreating(false); }}
              className="text-xs text-ink/60 hover:text-ink font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="policy-title" className="block text-xs font-bold text-ink mb-1">Policy Title *</label>
              <input
                id="policy-title"
                type="text"
                required
                value={editingPolicy.title || ''}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, title: e.target.value })}
                placeholder="e.g. Sanitary Dignity & Free Menstrual Hygiene Dispenser Project"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="policy-summary" className="block text-xs font-bold text-ink mb-1">One-Line Policy Summary *</label>
              <input
                id="policy-summary"
                type="text"
                required
                value={editingPolicy.summary || ''}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, summary: e.target.value })}
                placeholder="Brief summary of the commitment..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <label htmlFor="policy-issue-statement" className="block text-xs font-bold text-ink mb-1">Issue Statement (The Challenge) *</label>
              <textarea
                id="policy-issue-statement"
                required
                rows={4}
                value={editingPolicy.issue_statement || ''}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, issue_statement: e.target.value })}
                placeholder="What specific barrier or issue does this address on campus?"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="policy-solution" className="block text-xs font-bold text-ink mb-1">Proposed Solution *</label>
              <textarea
                id="policy-solution"
                required
                rows={4}
                value={editingPolicy.solution || ''}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, solution: e.target.value })}
                placeholder="What concrete action or initiative will be taken?"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="policy-implementation" className="block text-xs font-bold text-ink mb-1">Implementation Plan & Strategy</label>
              <textarea
                id="policy-implementation"
                rows={3}
                value={editingPolicy.implementation_plan || ''}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, implementation_plan: e.target.value })}
                placeholder="Execution roadmap and operational phases..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="policy-why-matters" className="block text-xs font-bold text-ink mb-1">Why It Matters</label>
              <textarea
                id="policy-why-matters"
                rows={3}
                value={editingPolicy.why_it_matters || ''}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, why_it_matters: e.target.value })}
                placeholder="Long-term impact on female student welfare..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="policy-status" className="block text-xs font-bold text-ink mb-1">Publication Status</label>
              <select
                id="policy-status"
                value={editingPolicy.status || 'draft'}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, status: e.target.value as ContentStatus })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              >
                <option value="draft">Draft (Private)</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published (Live to Students)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => { setEditingPolicy(null); setIsCreating(false); }}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink/70 hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2.5 px-6 gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Policy Item'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Policies List */
        <div className="space-y-4">
          {policies.length === 0 ? (
            <div className="campaign-card text-center p-12 bg-muted/20 border-dashed">
              <h3 className="text-base font-bold text-brand-navy mb-2">No Policy Commitments Created Yet</h3>
              <p className="text-xs text-ink/60 mb-6">Click below to draft the first policy item for the revealed platform.</p>
              <button onClick={handleCreateNew} className="btn-navy text-xs py-2 px-4 gap-2">
                <Plus className="w-4 h-4" />
                Add Policy Commitment
              </button>
            </div>
          ) : (
            policies.map((policy) => (
              <div key={policy.id} className="campaign-card flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge-published">{policy.status}</span>
                    <h3 className="text-base font-bold text-brand-navy">{policy.title}</h3>
                  </div>
                  <p className="text-xs text-ink/70">{policy.summary}</p>
                </div>
                <button
                  onClick={() => { setEditingPolicy(policy); setIsCreating(false); }}
                  className="btn-outline-navy text-xs py-2 px-3 gap-1.5 flex-shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
