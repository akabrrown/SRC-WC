import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../api/client.js';
import { VisionContent, CampaignValue, LeadershipPromise } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const MyVision: React.FC = () => {
  const [vision, setVision] = useState<VisionContent | null>(null);
  const [values, setValues] = useState<CampaignValue[]>([]);
  const [promises, setPromises] = useState<LeadershipPromise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [vis, val, prom] = await Promise.all([
          api.getVision(),
          api.getValues(),
          api.getPromises()
        ]);
        setVision(vis);
        setValues(val);
        setPromises(prom);
      } catch (err) {
        console.error('Failed to load vision content', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <LoadingState message="Loading vision & values..." />;
  }

  const visionStatement = vision?.vision_statement || '[Approved Vision Statement — Draft Pending Approval]';
  const missionStatement = vision?.mission_statement || '[Approved Mission Statement — Draft Pending Approval]';

  return (
    <div className="bg-surface py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
            Guiding Philosophy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
            Vision, Mission & Promises
          </h1>
          <div className="w-12 h-1 bg-brand-gold mx-auto rounded" />
        </div>

        {/* 1. Vision Statement (Pull-quote style with gold rule) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-20 h-0.5 bg-brand-gold mx-auto" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold">
            Draft Pending Final Approval
          </div>
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-navy leading-snug">
            "{visionStatement}"
          </blockquote>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
            The Vision for UPSA Women's Commission
          </p>
        </div>

        {/* 2. Mission Statement in Warm Off-White Card */}
        <div className="campaign-card bg-muted/60 p-8 sm:p-10 space-y-3 border-border">
          <div className="flex items-center gap-2 text-brand-navy">
            <Target className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg sm:text-xl font-bold">
              Our Mission
            </h2>
          </div>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed">
            {missionStatement}
          </p>
        </div>

        {/* 3. My Values (Grid of Cards) */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              Principles We Stand On
            </span>
            <h2 className="text-2xl font-extrabold text-brand-navy">
              My Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v) => (
              <div
                key={v.id}
                className="campaign-card bg-white p-5 space-y-2 border border-border hover:border-brand-gold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-gold" />
                  <h3 className="text-sm font-bold text-brand-navy">
                    {v.title}
                  </h3>
                </div>
                <p className="text-xs text-ink/70 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Leadership Promise (Numbered Commitments) */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              Accountability Framework
            </span>
            <h2 className="text-2xl font-extrabold text-brand-navy">
              Leadership Promises
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promises.map((p) => (
              <div
                key={p.id}
                className="campaign-card bg-white border-2 border-border p-6 flex flex-col justify-between space-y-4 hover:border-brand-navy transition-colors relative overflow-hidden"
              >
                <div className="text-4xl font-extrabold text-brand-gold font-mono">
                  0{p.promise_number}
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-brand-navy">
                    {p.title}
                  </h3>
                  <p className="text-xs text-ink/75 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-gold uppercase tracking-wider pt-2 border-t border-border">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solemn Commitment</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <Link
            to="/our-agenda"
            className="btn-navy w-full sm:w-auto text-xs py-3 px-6 gap-2"
          >
            <span>Preview Campaign Agenda</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/join-the-movement"
            className="btn-gold w-full sm:w-auto text-xs py-3 px-6"
          >
            Join the Movement
          </Link>
        </div>

      </div>
    </div>
  );
};
