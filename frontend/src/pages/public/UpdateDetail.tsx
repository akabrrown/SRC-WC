import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2, Check, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { api } from '../../api/client.js';
import { CampaignUpdate } from '../../types/index.js';
import { LoadingState, ErrorState } from '../../components/StateView.js';

export const UpdateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [update, setUpdate] = useState<CampaignUpdate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (id) fetchUpdate(id);
  }, [id]);

  const fetchUpdate = async (updateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUpdateById(updateId);
      setUpdate(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load this campaign update.');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-16">
        <LoadingState message="Loading campaign update..." />
      </div>
    );
  }

  if (error || !update) {
    return (
      <div className="min-h-screen bg-surface py-16">
        <ErrorState
          title="Update Not Found"
          message={error || 'The requested article is not available.'}
          onRetry={() => id && fetchUpdate(id)}
        />
        <div className="text-center mt-6">
          <Link to="/updates" className="btn-navy text-xs py-2 px-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to All Updates
          </Link>
        </div>
      </div>
    );
  }

  const shareText = encodeURIComponent(`${update.title} - SRC Women's Commissioner Campaign`);
  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <article className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/updates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Updates</span>
          </Link>
        </div>

        {/* Category & Date Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-brand-gold text-brand-navyDark text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {update.category.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-ink/60">
            <Calendar className="w-3.5 h-3.5 text-brand-gold" />
            <span>
              {new Date(update.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight mb-6">
          {update.title}
        </h1>

        {/* Cover Image or Hero Placeholder */}
        <div className="w-full h-64 sm:h-96 rounded-xl bg-brand-navyDark overflow-hidden mb-8 relative flex items-center justify-center shadow-md">
          {update.cover_image_url ? (
            <img
              src={update.cover_image_url}
              alt={update.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6">
              <span className="text-sm font-bold text-white/50 tracking-wider">
                [ OFFICIAL CAMPAIGN DISPATCH PHOTOGRAPHY ]
              </span>
            </div>
          )}
        </div>

        {/* Excerpt Callout */}
        {update.excerpt && (
          <div className="p-4 sm:p-5 rounded-lg bg-muted/60 border-l-4 border-brand-gold mb-8 text-sm sm:text-base font-medium text-brand-navyDark leading-relaxed">
            {update.excerpt}
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-sm sm:prose-base text-ink/80 leading-relaxed space-y-4 mb-12">
          {update.body.split('\n\n').map((para, idx) => (
            <p key={idx} className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Share Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
            <Share2 className="w-4 h-4 text-brand-gold" />
            <span>Share this dispatch:</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-muted hover:bg-border text-ink transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <LinkIcon className="w-3.5 h-3.5 text-ink/70" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
