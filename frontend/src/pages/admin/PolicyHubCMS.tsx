import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Save, Trash2, Edit2, Lock, Settings as SettingsIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { PolicyItem, SiteSettings, ContentStatus } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';
import { ConfirmModal } from '../../components/ConfirmModal.js';

export const PolicyHubCMS: React.FC = () => {
  const toast = useToast();
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingPolicy, setEditingPolicy] = useState<Partial<PolicyItem> | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteTargetPolicy, setDeleteTargetPolicy] = useState<PolicyItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Policy Hub CMS | Campaign Staff Portal';
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sett, pols] = await Promise.all([
        api.getSiteSettings(),
        api.getAllPoliciesAdmin()
      ]);
      setSettings(sett);
      setPolicies(Array.isArray(pols) ? pols : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load policy hub data.');
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
      timeline: 'Semester 1 – 2',
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
    if (!editingPolicy) return;

    if (!editingPolicy.title?.trim() || !editingPolicy.summary?.trim() || !editingPolicy.issue_statement?.trim() || !editingPolicy.solution?.trim()) {
      toast.error('Validation Error', 'Title, summary, issue statement, and proposed solution are required fields.');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const created = await api.createPolicy(editingPolicy);
        setPolicies([created, ...policies]);
        toast.success('Policy Commitment Created', `"${created.title}" added to policy platform.`);
      } else if (editingPolicy.id) {
        const updated = await api.updatePolicy(editingPolicy.id, editingPolicy);
        setPolicies(policies.map(p => p.id === updated.id ? updated : p));
        toast.success('Policy Commitment Updated', `"${updated.title}" updated successfully.`);
      }
      setEditingPolicy(null);
      setIsCreating(false);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save policy item.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetPolicy) return;
    setDeleting(true);
    try {
      await api.deletePolicy(deleteTargetPolicy.id);
      setPolicies(policies.filter(p => p.id !== deleteTargetPolicy.id));
      toast.success('Policy Deleted', `Policy commitment "${deleteTargetPolicy.title}" removed.`);
      setDeleteTargetPolicy(null);
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete policy commitment.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading policy platform data..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to Load Policy Hub"
        message={error}
        onRetry={fetchData}
      />
    );
  }

  const isTeaserMode = settings?.agenda_teaser_mode;

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            Manage the policy commitments, issue briefs, implementation milestones, and welfare initiatives.
          </p>
        </div>

        {!isTeaserMode && !editingPolicy && (
          <button
            onClick={handleCreateNew}
            className="btn-gold text-xs font-bold py-2.5 px-5 gap-2 shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Policy Commitment</span>
          </button>
        )}
      </div>

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
            Policy items are guarded while <strong>Agenda Teaser Mode</strong> is active. The public website currently serves the high-impact teaser experience with the Student Needs Survey.
          </p>
          <div className="pt-2">
            <Link
              to="/admin/launch-settings"
              className="btn-navy text-xs py-2.5 px-6 inline-flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4 text-brand-gold" />
              <span>Go to Launch Settings to Enable Platform Reveal</span>
            </Link>
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-semibold"
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
              disabled={saving}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink/70 hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2.5 px-6 gap-2 flex items-center"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Policy Item'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Policies List with Search & Filter */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-ink/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policy commitments..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border text-xs focus:border-brand-gold bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-ink/70">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-white"
              >
                <option value="all">All ({policies.length})</option>
                <option value="published">Published</option>
                <option value="approved">Approved</option>
                <option value="in_review">In Review</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {filteredPolicies.length === 0 ? (
            <EmptyState
              title="No Policy Commitments Found"
              message={searchQuery ? 'No policies matched your search filter.' : 'Click below to draft the first policy item for the revealed platform.'}
              actionText={searchQuery ? undefined : 'Add Policy Commitment'}
              onAction={searchQuery ? undefined : handleCreateNew}
            />
          ) : (
            filteredPolicies.map((policy) => (
              <div key={policy.id} className="campaign-card flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge-published">{policy.status}</span>
                    <h3 className="text-base font-bold text-brand-navy">{policy.title}</h3>
                  </div>
                  <p className="text-xs text-ink/70">{policy.summary}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingPolicy(policy); setIsCreating(false); }}
                    className="btn-outline-navy text-xs py-1.5 px-3 gap-1.5"
                    title="Edit Policy"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTargetPolicy(policy)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete Policy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetPolicy}
        title="Delete Policy Commitment"
        message={`Are you sure you want to permanently delete the policy commitment "${deleteTargetPolicy?.title}"? This cannot be undone.`}
        confirmText="Delete Policy"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetPolicy(null)}
      />
    </div>
  );
};
