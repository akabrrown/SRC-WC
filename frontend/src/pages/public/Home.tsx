import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Award, Calendar, ChevronRight, UserCheck } from 'lucide-react';
import { api } from '../../api/client.js';
import { CandidateProfile, CampaignValue, CampaignUpdate, SurveyLink } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const Home: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [values, setValues] = useState<CampaignValue[]>([]);
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [surveys, setSurveys] = useState<SurveyLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaignData() {
      try {
        const [profileData, valuesList, updatesList, surveyList] = await Promise.all([
          api.getCandidateProfile(),
          api.getValues(),
          api.getUpdates(),
          api.getSurveyLinks()
        ]);
        setCandidate(profileData);
        setValues(valuesList);
        setUpdates(updatesList.slice(0, 3));
        setSurveys(surveyList);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadCampaignData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading campaign home..." />;
  }

  const slogan = candidate?.slogan || '[Campaign Slogan Goes Here]';
  const displayName = candidate?.display_name || '[ Candidate Full Name ]';
  const institution = candidate?.institution_name || 'University of Professional Studies, Accra (UPSA)';

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-brand-navyDark text-white pt-12 pb-16 lg:py-20 border-b border-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-brand-navy px-3.5 py-1.5 rounded-full border border-brand-gold/40 text-xs font-semibold text-brand-goldLight">
                <Award className="w-3.5 h-3.5 text-brand-gold" />
                <span>OFFICIAL CAMPAIGN LAUNCH</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {slogan}
              </h1>

              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-bold text-brand-gold">
                  {displayName}
                </p>
                <p className="text-sm sm:text-base text-white/80 font-medium">
                  SRC Women's Commissioner Candidate — {institution}
                </p>
              </div>

              <p className="text-sm text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {candidate?.short_bio || 'Championing equity, female student leadership, welfare advocacy, and campus representation.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/join-the-movement"
                  className="btn-gold w-full sm:w-auto text-sm font-bold py-3.5 px-8 shadow-md"
                >
                  Join the Movement
                </Link>
                <Link
                  to="/meet-the-candidate"
                  className="btn-outline-white w-full sm:w-auto text-sm py-3.5 px-6"
                >
                  Meet the Candidate
                </Link>
              </div>
            </div>

            {/* Right Photo Block - Clean Typographic Placeholder */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl bg-brand-navy border-2 border-brand-gold/30 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                  <UserCheck className="w-12 h-12 text-brand-gold" />
                </div>
                <span className="text-xs font-mono font-semibold tracking-wider text-brand-gold uppercase bg-brand-navyDark px-3 py-1.5 rounded border border-brand-gold/40 mb-2">
                  [ CANDIDATE PHOTO PENDING ]
                </span>
                <p className="text-xs text-white/60 max-w-xs">
                  Awaiting official campaign studio photography from communications team.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUES STRIP */}
      <section className="bg-muted py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider whitespace-nowrap pr-2">
              Our Core Values:
            </span>
            {values.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-1.5 bg-white border border-border px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-navy shadow-sm whitespace-nowrap hover:border-brand-gold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                <span>{v.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LATEST CAMPAIGN UPDATES */}
      <section className="py-14 sm:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Latest News & Feed
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Campaign Updates
              </h2>
            </div>
            <Link
              to="/updates"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors group"
            >
              <span>View All Updates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((post) => (
              <article
                key={post.id}
                className="campaign-card flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Cover Image Placeholder */}
                  <div className="w-full aspect-[16/9] rounded-lg bg-brand-navy mb-4 flex items-center justify-center p-4 text-center border border-border">
                    <span className="text-[11px] font-mono text-white/70">
                      [ UPDATE COVER IMAGE ]
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-brand-goldLight text-brand-navyDark px-2 py-0.5 rounded">
                      {post.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-gold transition-colors leading-snug mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-ink/70 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-ink/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/updates/${post.id}`}
                    className="font-semibold text-brand-navy group-hover:text-brand-gold flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STUDENT VOICE CALLOUT BANNER */}
      <section className="py-12 bg-muted border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-navy text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-brand-navyDark relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-brand-gold text-brand-navyDark text-xs font-bold px-3 py-1 rounded-full">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>STUDENT PARTICIPATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Your Voice Shapes This Campaign
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                The campaign manifesto and agenda are actively built on real student issues.
                Share your campus concerns, suggest policy ideas, or participate in the official Women's Campus Needs Survey.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/student-voice"
                  className="btn-gold text-xs font-bold py-3 px-6 text-center"
                >
                  Take the Survey
                </Link>
                <Link
                  to="/student-voice"
                  className="btn-outline-white text-xs font-semibold py-3 px-6 text-center"
                >
                  Submit a Concern / Idea
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section className="py-14 bg-surface text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-2xl font-extrabold text-brand-navy">
            Ready to Stand for Progressive Leadership?
          </h2>
          <p className="text-xs sm:text-sm text-ink/70">
            Join hundreds of dedicated students across all faculties advocating for genuine representation.
          </p>
          <div className="pt-2">
            <Link
              to="/join-the-movement"
              className="btn-gold text-sm font-bold py-3.5 px-8 shadow-md"
            >
              Register as a Volunteer or Supporter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
