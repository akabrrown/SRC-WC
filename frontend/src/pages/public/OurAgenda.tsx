import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, CheckCircle, Bell, ArrowRight, BookOpen, Layers, ShieldCheck, TrendingUp } from 'lucide-react';
import { api } from '../../api/client.js';
import { SiteSettings, PolicyItem } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const OurAgenda: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [setts, pols] = await Promise.all([
          api.getSiteSettings(),
          api.getPolicies()
        ]);
        setSettings(setts);
        setPolicies(pols);
        if (pols.length > 0) setSelectedPolicy(pols[0]);
      } catch (err) {
        console.error('Failed to load agenda settings', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <LoadingState message="Checking agenda launch status..." />;
  }

  const isTeaserMode = settings?.agenda_teaser_mode ?? true;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail) {
      setNotified(true);
    }
  };

  return (
    <div className="bg-surface py-10 sm:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* MODE A: TEASER MODE (Launch Phase Default)                                */}
        {/* ========================================================================= */}
        {isTeaserMode ? (
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            {/* Header with Gold Coming Soon Badge */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-gold text-brand-navyDark shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                COMING SOON
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
                Our Agenda
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-brand-navy/70 uppercase tracking-wider">
                Built by Students, for Students
              </p>
            </div>

            {/* 16:9 Video Teaser Frame */}
            <div className="w-full aspect-[16/9] rounded-2xl bg-brand-navyDark border-2 border-brand-gold/40 shadow-2xl flex flex-col items-center justify-center p-6 text-center text-white relative group overflow-hidden">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-gold text-brand-navyDark flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-8 h-8 ml-1 fill-current" />
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-brand-gold uppercase">
                [ TEASER VIDEO PENDING ]
              </span>
              <p className="text-[11px] text-white/60 max-w-sm mt-1">
                Official campaign policy launch broadcast will stream here prior to campus debates.
              </p>
            </div>

            {/* Teaser Narrative */}
            <div className="space-y-4 text-ink/80 text-sm sm:text-base leading-relaxed text-left bg-muted/40 p-6 sm:p-8 rounded-xl border border-border">
              <p>
                Our policy manifesto is currently in active co-creation with the UPSA student body. Rather than presenting generic pledges, every pillar is being informed by real data collected across lecture halls, hostels, and student associations.
              </p>
              <p>
                The complete policy platform covering academic welfare, hostel safety, health resources, mentorship pipelines, and career advancement will be officially unveiled during the grand campaign reveal.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/student-voice"
                  className="btn-gold w-full sm:w-auto text-sm font-bold py-3.5 px-8 shadow-md text-center"
                >
                  Take the Needs Survey
                </Link>
                <a
                  href="#notify-form"
                  className="btn-outline-navy w-full sm:w-auto text-sm py-3.5 px-6 text-center"
                >
                  Notify Me at Reveal
                </a>
              </div>

              {/* Email Notification Capture Box */}
              <div id="notify-form" className="pt-6">
                {notified ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>You are on the priority list. We will notify you the moment the full agenda is revealed.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <label htmlFor="reveal-notify-email" className="sr-only">
                      Student email for reveal alert
                    </label>
                    <input
                      id="reveal-notify-email"
                      type="email"
                      required
                      placeholder="Enter student email for reveal alert"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-btn border border-border text-xs focus:ring-2 focus:ring-brand-gold outline-none"
                    />
                    <button
                      type="submit"
                      className="btn-navy text-xs py-2.5 px-5 flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notify Me</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* MODE B: REVEALED POLICY PLATFORM                                         */
          /* ========================================================================= */
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                OFFICIALLY REVEALED
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
                Our Policy Platform
              </h1>
              <p className="text-sm text-ink/75 max-w-xl mx-auto">
                Comprehensive solutions formulated to address key challenges faced by female students at UPSA.
              </p>
            </div>

            {policies.length === 0 ? (
              <div className="campaign-card text-center p-12 bg-muted/40">
                <p className="text-sm text-ink/70">No policy documents published yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Policy List */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-2">
                    Policy Pillars
                  </span>
                  {policies.map((p) => {
                    const isSelected = selectedPolicy?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPolicy(p)}
                        className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-bold ${
                          isSelected
                            ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                            : 'bg-white text-ink border-border hover:border-brand-gold'
                        }`}
                      >
                        {p.title}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Policy Detail Breakdown (5 Pillars) */}
                {selectedPolicy && (
                  <div className="lg:col-span-8 campaign-card p-6 sm:p-8 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-brand-navy mb-2">
                        {selectedPolicy.title}
                      </h2>
                      <p className="text-xs text-ink/70 leading-relaxed">
                        {selectedPolicy.summary}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                          <span>The Challenge / Issue</span>
                        </span>
                        <p className="text-xs text-ink/80 leading-relaxed bg-red-50/60 p-3.5 rounded-lg border border-red-100">
                          {selectedPolicy.issue_statement}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <span>The Solution & Implementation</span>
                        </span>
                        <p className="text-xs text-ink/80 leading-relaxed bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-100">
                          {selectedPolicy.solution}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                          Why It Matters
                        </span>
                        <p className="text-xs text-ink/80 leading-relaxed">
                          {selectedPolicy.why_it_matters}
                        </p>
                      </div>

                      {selectedPolicy.implementation_plan && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                            Implementation Roadmap & Timeline
                          </span>
                          <p className="text-xs text-ink/80 leading-relaxed">
                            {selectedPolicy.implementation_plan}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
