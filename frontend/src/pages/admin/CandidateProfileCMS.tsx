import React, { useState, useEffect } from 'react';
import { User, Save, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon, Tag } from 'lucide-react';
import { api } from '../../api/client.js';
import { CandidateProfile } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

import { useToast } from '../../context/ToastContext.js';

export const CandidateProfileCMS: React.FC = () => {
  const toast = useToast();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getCandidateProfile();
      setProfile(data);
    } catch (err: any) {
      toast.error('Fetch Failed', err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    try {
      const updated = await api.updateCandidateProfile(profile);
      setProfile(updated);
      toast.success('Profile Saved', 'Candidate profile updated successfully.');
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <LoadingState message="Loading candidate profile editor..." />;
  }

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-red-600">Failed to load candidate profile.</p>
      </div>
    );
  }

  const isFieldPlaceholder = (val?: string) => {
    return !val || val.trim() === '' || val.includes('[') || val.includes('Pending');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Identity & Editorial Content</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            Candidate Profile Editor
          </h1>
          <p className="text-xs text-ink/65">
            Manage official name, position, programme, campaign slogan, biography, and photography.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Section 1: Basic Info */}
        <div className="campaign-card">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy">
              1. Basic Candidate Information
            </h2>
            <span className="text-[11px] text-ink/50">Displayed in Hero & Navigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Full Official Name</label>
                {isFieldPlaceholder(profile.full_name) && (
                  <span className="placeholder-badge text-[10px]">Awaiting Client Input</span>
                )}
              </div>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Display Name (Short / Preferred)</label>
                {isFieldPlaceholder(profile.display_name) && (
                  <span className="placeholder-badge text-[10px]">Awaiting Client Input</span>
                )}
              </div>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Position Contesting</label>
              </div>
              <input
                type="text"
                value={profile.position_title}
                onChange={(e) => setProfile({ ...profile, position_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Institution</label>
              </div>
              <input
                type="text"
                value={profile.institution_name}
                onChange={(e) => setProfile({ ...profile, institution_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Academic Programme</label>
                {isFieldPlaceholder(profile.programme) && (
                  <span className="placeholder-badge text-[10px]">Awaiting Client Input</span>
                )}
              </div>
              <input
                type="text"
                value={profile.programme}
                onChange={(e) => setProfile({ ...profile, programme: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Academic Level</label>
              </div>
              <select
                value={profile.level}
                onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
              >
                <option value="100">Level 100</option>
                <option value="200">Level 200</option>
                <option value="300">Level 300</option>
                <option value="400">Level 400</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Bio & Slogan */}
        <div className="campaign-card">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy">
              2. Slogan, Story & Photos
            </h2>
            <span className="text-[11px] text-ink/50">Displayed in Meet Candidate & Home</span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Campaign Slogan (H1 Headline)</label>
                {isFieldPlaceholder(profile.slogan) && (
                  <span className="placeholder-badge text-[10px]">Awaiting Client Input</span>
                )}
              </div>
              <input
                type="text"
                value={profile.slogan}
                onChange={(e) => setProfile({ ...profile, slogan: e.target.value })}
                placeholder="e.g. Empowering Every Woman, Elevating Every Voice"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-ink">Candidate Biography / My Story</label>
                {isFieldPlaceholder(profile.short_bio) && (
                  <span className="placeholder-badge text-[10px]">Draft Pending Approval</span>
                )}
              </div>
              <textarea
                rows={5}
                value={profile.short_bio}
                onChange={(e) => setProfile({ ...profile, short_bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white leading-relaxed resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Hero Photo URL
                </label>
                <input
                  type="text"
                  value={profile.hero_photo_url || ''}
                  onChange={(e) => setProfile({ ...profile, hero_photo_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../hero.jpg"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-mono text-xs"
                />
                <p className="text-[11px] text-ink/50 mt-1">
                  Leave empty to render the silhouette placeholder.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Favicon URL
                </label>
                <input
                  type="text"
                  value={profile.favicon_url || ''}
                  onChange={(e) => setProfile({ ...profile, favicon_url: e.target.value })}
                  placeholder="https://.../favicon.ico"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: SEO Meta */}
        <div className="campaign-card">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy">
              3. Search Engine Optimization (SEO)
            </h2>
            <span className="text-[11px] text-ink/50">
              {(profile.seo_description || '').length}/160 characters
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={3}
              maxLength={160}
              value={profile.seo_description || ''}
              onChange={(e) => setProfile({ ...profile, seo_description: e.target.value })}
              placeholder="Official campaign website for the SRC Women's Commissioner candidate at UPSA..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-4 z-20 p-4 rounded-xl bg-brand-navyDark text-white shadow-2xl flex items-center justify-between border border-white/20">
          <div className="text-xs text-white/70">
            Last modified: {new Date(profile.updated_at).toLocaleTimeString()}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-gold text-xs font-bold py-2.5 px-6 gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save & Publish Profile'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
