import React, { useState, useEffect } from 'react';
import { MessageSquare, ClipboardList, Lightbulb, CheckCircle2, AlertCircle, Plus, Save, ExternalLink } from 'lucide-react';
import { api } from '../../api/client.js';
import { StudentVoiceSubmission, SurveyLink } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';

export const StudentVoiceCMS: React.FC = () => {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<StudentVoiceSubmission[]>([]);
  const [surveys, setSurveys] = useState<SurveyLink[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'surveys'>('inbox');
  const [loading, setLoading] = useState<boolean>(true);
  const [editingSurvey, setEditingSurvey] = useState<Partial<SurveyLink> | null>(null);
  const [savingSurvey, setSavingSurvey] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subs, survs] = await Promise.all([
        api.getStudentVoiceSubmissions(),
        api.getSurveyLinks()
      ]);
      setSubmissions(subs);
      setSurveys(survs);
    } catch (err) {
      console.error('Failed to load student voice data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateStudentVoiceStatus(id, newStatus);
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
      toast.success('Status Updated', `Submission status changed to "${newStatus}".`);
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Status update failed.');
    }
  };

  const handleSaveSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSurvey || !editingSurvey.form_name) return;
    setSavingSurvey(true);
    try {
      if (editingSurvey.id) {
        const updated = await api.updateSurveyLink(editingSurvey.id, editingSurvey);
        setSurveys(surveys.map(s => s.id === updated.id ? updated : s));
        toast.success('Survey Updated', `Survey "${updated.form_name}" saved.`);
      } else {
        const created = await api.createSurveyLink(editingSurvey);
        setSurveys([...surveys, created]);
        toast.success('Survey Created', `Survey "${created.form_name}" published.`);
      }
      setEditingSurvey(null);
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save survey link.');
    } finally {
      setSavingSurvey(false);
    }
  };


  if (loading) {
    return <LoadingState message="Loading student voice intelligence..." />;
  }

  const unreadCount = submissions.filter(s => s.status === 'new').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Student Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Student Voice & Survey Hub
          </h1>
          <p className="text-xs text-ink/65">
            Review student concerns, grassroots policy suggestions, and external feedback surveys.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1 rounded-xl bg-muted border border-border">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeTab === 'inbox' ? 'bg-brand-navy text-brand-gold shadow-sm' : 'text-ink/70'
            }`}
          >
            Submissions Inbox ({unreadCount} new)
          </button>
          <button
            onClick={() => setActiveTab('surveys')}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeTab === 'surveys' ? 'bg-brand-navy text-brand-gold shadow-sm' : 'text-ink/70'
            }`}
          >
            External Survey Links ({surveys.length})
          </button>
        </div>
      </div>

      {activeTab === 'inbox' ? (
        <div className="campaign-card !p-0 overflow-hidden">

          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-bold text-brand-navy">
              All Submissions ({submissions.length})
            </span>
          </div>

          <div className="divide-y divide-border">
            {submissions.length === 0 ? (
              <div className="p-12 text-center text-ink/50 text-xs">
                No student voice submissions received yet.
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="p-5 hover:bg-muted/10 transition-colors space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        sub.type === 'concern' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.type === 'concern' ? 'Campus Concern' : 'Policy Idea'}
                      </span>
                      <span className="font-bold text-xs text-brand-navy">
                        {sub.name || 'Anonymous Student'}
                      </span>
                      {sub.programme && (
                        <span className="text-[11px] text-ink/50">({sub.programme})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-ink/50">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                      <select
                        value={sub.status}
                        onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          sub.status === 'new'
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : sub.status === 'responded'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                            : 'bg-muted border-border text-ink/70'
                        }`}
                      >
                        <option value="new">New (Unread)</option>
                        <option value="read">Read</option>
                        <option value="responded">Addressed / Responded</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink/80 leading-relaxed bg-muted/20 p-3.5 rounded-lg">
                    {sub.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Surveys Manager */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy">
              External Google Form & Survey Cards
            </h2>
            <button
              onClick={() => setEditingSurvey({ form_name: '', platform: 'Google Forms', url: '', status: 'live' })}
              className="btn-gold text-xs font-bold py-2 px-4 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Survey Link</span>
            </button>
          </div>

          {editingSurvey && (
            <form onSubmit={handleSaveSurvey} className="campaign-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-2">
                {editingSurvey.id ? 'Edit Survey Card' : 'New Survey Card'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Form Name *</label>
                  <input
                    type="text"
                    required
                    value={editingSurvey.form_name || ''}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, form_name: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Platform</label>
                  <input
                    type="text"
                    value={editingSurvey.platform || 'Google Forms'}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink mb-1">Survey URL *</label>
                  <input
                    type="url"
                    required
                    value={editingSurvey.url || ''}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, url: e.target.value })}
                    placeholder="https://forms.gle/..."
                    className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Status</label>
                  <select
                    value={editingSurvey.status || 'live'}
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded border border-border text-xs focus:border-brand-gold bg-white"
                  >
                    <option value="live">Live (Active Button)</option>
                    <option value="coming_soon">Coming Soon (Disabled Button)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSurvey(null)}
                  className="px-3 py-1.5 text-xs text-ink/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSurvey}
                  className="btn-gold text-xs font-bold py-1.5 px-4"
                >
                  Save Survey
                </button>
              </div>
            </form>
          )}

          <div className="campaign-card !p-0 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-ink/60 uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="py-3 px-4">Form Name</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">URL</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {surveys.map((surv) => (
                  <tr key={surv.id}>
                    <td className="py-3 px-4 font-bold text-brand-navy">{surv.form_name}</td>
                    <td className="py-3 px-4 text-ink/60">{surv.platform}</td>
                    <td className="py-3 px-4 font-mono text-ink/70 truncate max-w-xs">{surv.url}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        surv.status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {surv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingSurvey(surv)}
                        className="text-xs font-bold text-brand-navy hover:text-brand-gold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
