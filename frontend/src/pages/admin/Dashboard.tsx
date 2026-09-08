import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  MessageSquare,
  CheckCircle2,
  Settings,
  Newspaper,
  Calendar,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  ToggleRight,
  BookOpen
} from 'lucide-react';
import { api } from '../../api/client.js';
import { SiteSettings, CampaignUpdate, ContactSubmission, StudentVoiceSubmission, Testimonial } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const Dashboard: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [voiceSubs, setVoiceSubs] = useState<StudentVoiceSubmission[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sett, upds, cnts, vce, tst] = await Promise.all([
        api.getSiteSettings(),
        api.getAllUpdatesAdmin(),
        api.getContactSubmissions(),
        api.getStudentVoiceSubmissions(),
        api.getAllTestimonialsAdmin()
      ]);
      setSettings(sett);
      setUpdates(upds);
      setContacts(cnts);
      setVoiceSubs(vce);
      setTestimonials(tst);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading dashboard intelligence..." />;
  }

  const unreadContacts = contacts.filter((c) => c.status === 'new').length;
  const unreadVoice = voiceSubs.filter((v) => v.status === 'new').length;
  const pendingUpdates = updates.filter((u) => u.status === 'in_review' || u.status === 'draft').length;
  const pendingTestimonials = testimonials.filter((t) => t.status === 'in_review' || !t.consent_confirmed).length;
  const totalPending = pendingUpdates + pendingTestimonials;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Launch Phase Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
        settings?.agenda_teaser_mode
          ? 'bg-amber-50/70 border-amber-300/80 text-amber-950'
          : 'bg-emerald-50/70 border-emerald-300/80 text-emerald-950'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            settings?.agenda_teaser_mode ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
          }`}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider">
                Current Campaign Launch Phase:
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                settings?.agenda_teaser_mode
                  ? 'bg-brand-gold text-brand-navyDark shadow-xs'
                  : 'bg-emerald-600 text-white shadow-xs'
              }`}>
                {settings?.agenda_teaser_mode ? 'Agenda: Teaser Mode' : 'Agenda: Policy Reveal (Unlocked)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink/75 mt-1">
              {settings?.agenda_teaser_mode
                ? 'The public /our-agenda page renders the high-impact teaser experience. Policy items stay locked until official reveal.'
                : 'The full 5-pillar policy hub is live to students on the public website.'}
            </p>
          </div>
        </div>

        <Link
          to="/admin/launch-settings"
          className="btn-navy text-xs py-2 px-4 whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          Phase Settings
        </Link>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pending Approvals */}
        <div className="campaign-card bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-brand-navy tracking-tight block">
              {totalPending}
            </span>
            <span className="text-xs text-ink/60 font-medium mt-1 block">
              {pendingUpdates} updates, {pendingTestimonials} endorsements
            </span>
          </div>
        </div>

        {/* Card 2: Unread Contact Messages */}
        <div className="campaign-card bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Unread Messages
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-brand-navy tracking-tight block">
              {unreadContacts}
            </span>
            <span className="text-xs text-ink/60 font-medium mt-1 block">
              {contacts.length} total contact inquiries logged
            </span>
          </div>
        </div>

        {/* Card 3: Unread Student Voice */}
        <div className="campaign-card bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Student Voice
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-brand-navy tracking-tight block">
              {unreadVoice}
            </span>
            <span className="text-xs text-ink/60 font-medium mt-1 block">
              {voiceSubs.length} total concerns & ideas submitted
            </span>
          </div>
        </div>

        {/* Card 4: Launch Status */}
        <div className="campaign-card bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Election Date
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-lg font-extrabold text-brand-navy tracking-tight block truncate">
              {settings?.election_date ? new Date(settings.election_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date Pending'}
            </span>
            <span className="text-xs text-brand-gold font-bold mt-1 block">
              UPSA SRC Elections
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy mb-4">
          Quick Management Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/candidate"
            className="campaign-card hover:border-brand-gold/60 transition-colors p-5 flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                Candidate Profile
              </h3>
              <p className="text-xs text-ink/60">Edit slogan, bio & photos</p>
            </div>
            <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/updates"
            className="campaign-card hover:border-brand-gold/60 transition-colors p-5 flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                Publish Update
              </h3>
              <p className="text-xs text-ink/60">Post dispatches & news</p>
            </div>
            <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/volunteers"
            className="campaign-card hover:border-brand-gold/60 transition-colors p-5 flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                Volunteers List
              </h3>
              <p className="text-xs text-ink/60">Export mobilisation data</p>
            </div>
            <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/student-voice"
            className="campaign-card hover:border-brand-gold/60 transition-colors p-5 flex items-center justify-between group"
          >
            <div>
              <h3 className="text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                Review Feedback
              </h3>
              <p className="text-xs text-ink/60">Student concerns & ideas</p>
            </div>
            <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
};
