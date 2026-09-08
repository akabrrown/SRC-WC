import React, { useState, useEffect } from 'react';
import { Quote, CheckCircle, Play, HeartHandshake } from 'lucide-react';
import { api } from '../../api/client.js';
import { Testimonial } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';

export const VoicesOfSupport: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const testimonialList = await api.getTestimonials();
      setTestimonials(testimonialList);
    } catch (err: any) {
      setError(err.message || 'Unable to load peer endorsements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-brand-gold" />
            <span>Student Endorsements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Voices of Support
          </h1>
          <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
            Hear from students, departmental executives, hall residents, and student leaders who have experienced our candidate's commitment to advocacy and service firsthand.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState message="Loading student voices of support..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTestimonials} />
        ) : testimonials.length === 0 ? (
          <EmptyState
            title="Endorsements Being Verified"
            message="Peer testimonials are currently undergoing verification and will appear here shortly."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="campaign-card flex flex-col justify-between relative group hover:border-brand-gold/60 transition-colors"
              >
                {/* Verified Consent Badge */}
                {testimonial.consent_confirmed && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Verified Consent</span>
                  </div>
                )}

                <div>
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-brand-gold/30 mb-3" />

                  {/* Statement */}
                  <blockquote className="text-xs sm:text-sm text-ink/80 italic leading-relaxed mb-6 font-normal">
                    "{testimonial.statement}"
                  </blockquote>
                </div>

                {/* Author Info & Avatar / Video */}
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full bg-brand-navyDark text-white flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden shadow-sm">
                    {testimonial.photo_url ? (
                      <img src={testimonial.photo_url} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{testimonial.name.slice(0, 2).toUpperCase()}</span>
                    )}

                    {testimonial.video_url && (
                      <div className="absolute inset-0 bg-brand-navyDark/60 flex items-center justify-center text-brand-gold">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-brand-navy leading-tight">
                      {testimonial.name}
                    </h3>
                    <p className="text-[11px] text-ink/60 font-medium">
                      {testimonial.programme_role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
