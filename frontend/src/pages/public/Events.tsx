import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ExternalLink, CalendarDays } from 'lucide-react';
import { api } from '../../api/client.js';
import { CampaignEvent } from '../../types/index.js';
import { LoadingState, ErrorState } from '../../components/StateView.js';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<CampaignEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch campus events.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((e) => {
    const d = new Date(e.event_date);
    return d >= today;
  });

  const pastEvents = events.filter((e) => {
    const d = new Date(e.event_date);
    return d < today;
  });

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider mb-3">
            <CalendarDays className="w-3.5 h-3.5 text-brand-gold" />
            <span>Campus Gatherings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Campaign Events & Townhalls
          </h1>
          <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
            Join us for interactive discussions, hall visits, leadership symposiums, and student forums across campus.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-muted border border-border">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg transition-all min-h-[44px] ${
                activeTab === 'upcoming'
                  ? 'bg-brand-navy text-brand-gold shadow-sm'
                  : 'text-ink/70 hover:text-brand-navy'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg transition-all min-h-[44px] ${
                activeTab === 'past'
                  ? 'bg-brand-navy text-brand-gold shadow-sm'
                  : 'text-ink/70 hover:text-brand-navy'
              }`}
            >
              Past Engagements ({pastEvents.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState message="Loading events schedule..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchEvents} />
        ) : displayedEvents.length === 0 ? (
          <div className="campaign-card text-center p-12 max-w-lg mx-auto bg-muted/30 border-dashed">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-brand-navy mb-2">
              {activeTab === 'upcoming' ? 'No Upcoming Events Right Now' : 'No Past Events Recorded'}
            </h3>
            <p className="text-xs sm:text-sm text-ink/65 leading-relaxed">
              {activeTab === 'upcoming'
                ? 'Check back soon as we finalize dates for hall tours, leadership workshops, and campaign townhalls.'
                : 'Archived records of past events and discussions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedEvents.map((evt) => (
              <div
                key={evt.id}
                className="campaign-card flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:border-brand-gold/50 transition-colors"
              >
                {/* Left Date Badge + Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-navy flex flex-col items-center justify-center text-white flex-shrink-0 shadow-sm border border-brand-navyDark">
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider">
                      {new Date(evt.event_date).toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                    <span className="text-xl font-extrabold leading-none">
                      {new Date(evt.event_date).getDate()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base sm:text-lg font-bold text-brand-navy leading-snug">
                      {evt.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-ink/70">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{evt.event_time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-ink/75 leading-relaxed pt-1">
                      {evt.description}
                    </p>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex-shrink-0 md:self-center">
                  {evt.registration_link ? (
                    <a
                      href={evt.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-navy text-xs font-bold py-2.5 px-5 gap-2 w-full md:w-auto"
                    >
                      <span>Register</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-ink/50 bg-muted px-3 py-1.5 rounded-lg">
                      Open Campus Access
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
