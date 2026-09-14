import React, { useState, useEffect } from 'react';
import { Settings, Save, Calendar, Video } from 'lucide-react';
import { api } from '../../api/client.js';
import { SiteSettings } from '../../types/index.js';
import { LoadingState, ErrorState } from '../../components/StateView.js';
import { useToast } from '../../context/ToastContext.js';

export const LaunchSettingsCMS: React.FC = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Launch Phase & Settings CMS | Campaign Staff Portal';
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSiteSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load site settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const updated = await api.updateSiteSettings({
        ...settings,
        teaser_video_url: settings.teaser_video_url?.trim() || '',
        election_date: settings.election_date?.trim() || ''
      });
      setSettings(updated);
      toast.success('Settings Saved', 'Launch phase and operational settings updated live.');
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading launch-phase settings..." />;
  }

  if (error || !settings) {
    return (
      <ErrorState
        title="Failed to Load Settings"
        message={error || 'Could not retrieve campaign settings.'}
        onRetry={fetchSettings}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Campaign Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Launch-Phase & Site Settings
          </h1>
          <p className="text-xs text-ink/65">
            Switch between Campaign Teaser Mode and Full Policy Reveal without code redeployment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Phase Toggle 1: Agenda Teaser Mode */}
        <div className="campaign-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                  1. Agenda Teaser Mode
                </span>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  settings.agenda_teaser_mode ? 'bg-brand-gold text-brand-navyDark' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {settings.agenda_teaser_mode ? 'ACTIVE (TEASER)' : 'UNLOCKED (REVEALED)'}
                </span>
              </div>
              <p className="text-xs text-ink/70 max-w-xl leading-relaxed">
                When enabled, the public <code>/our-agenda</code> page displays the high-impact teaser template and student survey CTA. When disabled, the full policy platform unlocks automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, agenda_teaser_mode: !settings.agenda_teaser_mode })}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                settings.agenda_teaser_mode ? 'bg-brand-gold' : 'bg-slate-300'
              }`}
              aria-label="Toggle Teaser Mode"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                  settings.agenda_teaser_mode ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 text-xs text-ink/75 leading-relaxed space-y-1">
            <p><strong>Teaser Mode Active:</strong> Public sees video placeholder, "Coming Soon" badge, and Needs Survey button.</p>
            <p><strong>Teaser Mode Inactive:</strong> Public sees full policy platform with Challenge, Solution, and Implementation Roadmaps.</p>
          </div>
        </div>

        {/* Phase Toggle 2: Accountability Tracker */}
        <div className="campaign-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                  2. Post-Election Accountability Tracker
                </span>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  settings.accountability_tracker_visible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {settings.accountability_tracker_visible ? 'VISIBLE' : 'HIDDEN'}
                </span>
              </div>
              <p className="text-xs text-ink/70 max-w-xl leading-relaxed">
                Controls the visibility of the post-election governance commitment tracker for students to monitor promise fulfillment.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSettings({ ...settings, accountability_tracker_visible: !settings.accountability_tracker_visible })}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                settings.accountability_tracker_visible ? 'bg-brand-gold' : 'bg-slate-300'
              }`}
              aria-label="Toggle Tracker"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                  settings.accountability_tracker_visible ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Video & Election Date Controls */}
        <div className="campaign-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-3 mb-5">
            3. Campaign Video & Election Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-brand-gold" />
                <span>Teaser / Campaign Video URL</span>
              </label>
              <input
                type="text"
                value={settings.teaser_video_url || ''}
                onChange={(e) => setSettings({ ...settings, teaser_video_url: e.target.value })}
                placeholder="https://www.youtube.com/embed/... or direct video link"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
              <p className="text-[11px] text-ink/50 mt-1">
                Embedded directly into the Our Agenda teaser video player frame.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                <span>Election Voting Date</span>
              </label>
              <input
                type="date"
                value={settings.election_date || ''}
                onChange={(e) => setSettings({ ...settings, election_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
              <p className="text-[11px] text-ink/50 mt-1">
                Drives countdowns and election milestone alerts across the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-4 z-20 p-4 rounded-xl bg-brand-navyDark text-white shadow-2xl flex items-center justify-between border border-white/20">
          <div className="text-xs text-white/70">
            Changes take effect across the entire public website instantaneously.
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-gold text-xs font-bold py-2.5 px-6 gap-2 flex items-center"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Launch Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
