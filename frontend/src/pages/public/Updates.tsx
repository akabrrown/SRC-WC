import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { api } from '../../api/client.js';
import { CampaignUpdate, UpdateCategory } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'News', value: 'news' },
  { label: 'Engagement', value: 'engagement' },
  { label: 'Policy Update', value: 'policy_update' },
  { label: 'Speech', value: 'speech' },
  { label: 'Media Feature', value: 'media_feature' },
  { label: 'Milestone', value: 'milestone' }
];

export const Updates: React.FC = () => {
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpdates(activeCategory);
  }, [activeCategory]);

  const fetchUpdates = async (cat: string) => {
    setLoading(true);
    setError(null);
    try {
      const updateList = await api.getUpdates(cat === 'all' ? undefined : cat);
      setUpdates(updateList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaign updates.');
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryLabel = (category: UpdateCategory) => {
    return category
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider mb-3">
            <Newspaper className="w-3.5 h-3.5 text-brand-gold" />
            <span>Campaign Dispatches</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Campaign Updates & News
          </h1>
          <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
            Follow the latest news, campus engagements, student dialogues, and milestones from our leadership movement.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 min-h-[40px] ${
                  isActive
                    ? 'bg-brand-gold text-brand-navyDark shadow-sm'
                    : 'bg-white border border-brand-navy/20 text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Content States */}
        {loading ? (
          <LoadingState message="Fetching latest campaign dispatches..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchUpdates(activeCategory)} />
        ) : updates.length === 0 ? (
          <EmptyState
            title="No Updates Found"
            message={`No published updates currently found in the "${CATEGORIES.find(c => c.value === activeCategory)?.label}" category.`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((post) => (
              <article
                key={post.id}
                className="campaign-card flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Cover Image or Placeholder */}
                  <div className="w-full h-44 rounded-lg bg-brand-navyDark overflow-hidden mb-4 relative flex items-center justify-center">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-xs font-bold text-white/50 tracking-wider">
                          [ CAMPAIGN PHOTO ]
                        </span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-brand-gold text-brand-navyDark text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      {formatCategoryLabel(post.category)}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h2 className="text-base sm:text-lg font-bold text-brand-navy mb-2 leading-snug group-hover:text-brand-gold transition-colors">
                    <Link to={`/updates/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-ink/70 line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt || post.body.slice(0, 120) + '...'}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink/60">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <Link
                    to={`/updates/${post.id}`}
                    className="inline-flex items-center gap-1 font-bold text-brand-navy group-hover:text-brand-gold transition-colors"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
