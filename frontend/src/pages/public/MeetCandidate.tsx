import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Quote, Award, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { api } from '../../api/client.js';
import { CandidateProfile } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const MeetCandidate: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidateProfile() {
      try {
        const profile = await api.getCandidateProfile();
        setCandidate(profile);
      } catch (err) {
        console.error('Failed to load candidate profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidateProfile();
  }, []);

  if (loading) {
    return <LoadingState message="Loading candidate profile..." />;
  }

  const name = candidate?.full_name || '[Candidate Full Name]';
  const programme = candidate?.programme || '[Programme]';
  const level = candidate?.level || 'Level [X]';
  const slogan = candidate?.slogan || '[Campaign Slogan Goes Here]';

  return (
    <div className="bg-surface py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb / Section Tag */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
            Leadership & Biography
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
            Meet the Candidate
          </h1>
          <div className="w-12 h-1 bg-brand-gold mx-auto rounded" />
        </div>

        {/* 1. Header Profile Card */}
        <div className="campaign-card bg-muted/40 p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-brand-navy border-2 border-brand-gold/40 flex flex-col items-center justify-center p-3 text-center flex-shrink-0 shadow-lg">
            <User className="w-12 h-12 text-brand-gold mb-2" />
            <span className="text-[10px] font-mono text-white/80 uppercase font-semibold">
              [ CANDIDATE PHOTO PENDING ]
            </span>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
              <span>Placeholder — Awaiting Client Bio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              {name}
            </h2>
            <p className="text-sm font-semibold text-brand-navy/80">
              {programme} · {level} · Candidate for SRC Women's Commissioner
            </p>
            <p className="text-xs sm:text-sm text-ink/75 italic">
              "{slogan}"
            </p>
          </div>
        </div>

        {/* 2. My Story Section */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              Background & Purpose
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-brand-navy">
              My Story
            </h3>
          </div>

          <div className="prose prose-sm max-w-none text-ink/80 space-y-4 leading-relaxed">
            <p className="text-sm sm:text-base">
              {candidate?.short_bio || 
                'Driven by an unyielding dedication to student welfare, equity, and peer support on campus, the candidate has spent years engaging directly with student communities, understanding their daily struggles with accommodation, academic workload, security, and mentorship.'}
            </p>
            <p className="text-sm sm:text-base">
              The SRC Women's Commission is not merely an office—it is a platform for principled advocacy. Through inclusive student consultations, campus-wide partnerships, and hands-on capacity building initiatives, the candidate aims to ensure every female student at UPSA has the resources, voice, and opportunities to excel academically and professionally.
            </p>
          </div>
        </div>

        {/* 3. Photo Gallery Strip */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
            Campus Engagements & Moments
          </h4>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="aspect-square rounded-xl bg-brand-navy/10 border border-border flex flex-col items-center justify-center p-2 text-center"
              >
                <span className="text-[10px] sm:text-xs font-mono text-ink/60 font-semibold">
                  [ campaign photo {num} pending ]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Editorial Pull-Quote Card */}
        <div className="bg-brand-navy text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <Quote className="w-16 h-16 text-brand-gold/30 absolute -top-2 -left-2 rotate-180" />
          <div className="relative z-10 space-y-4">
            <p className="text-base sm:text-lg font-medium italic text-white/95 leading-relaxed">
              "True leadership is not about title or prestige; it is about active listening, courageous advocacy, and leaving the university community visibly better for every single woman who walks through our gates."
            </p>
            <div className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              — {name}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <Link
            to="/my-vision"
            className="btn-navy w-full sm:w-auto text-xs py-3 px-6 gap-2"
          >
            <span>Explore Vision & Values</span>
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
