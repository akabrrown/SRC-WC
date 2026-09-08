import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Lightbulb, ClipboardList, BarChart3, Send, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { api } from '../../api/client.js';
import { SurveyLink } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const StudentVoice: React.FC = () => {
  const [surveys, setSurveys] = useState<SurveyLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State for Native Submissions
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submissionType, setSubmissionType] = useState<'concern' | 'idea'>('concern');
  const [formData, setFormData] = useState({
    name: '',
    programme: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen && !submitting) {
        setModalOpen(false);
        return;
      }
      if (e.key === 'Tab' && modalOpen && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen, submitting]);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const surveyLinksList = await api.getSurveyLinks();
      setSurveys(surveyLinksList);
    } catch {
      // Graceful fallback if database empty
    } finally {
      setLoading(false);
    }
  };

  const openNativeModal = (type: 'concern' | 'idea') => {
    setSubmissionType(type);
    setSuccess(false);
    setFormError(null);
    setFormData({ name: '', programme: '', message: '' });
    setModalOpen(true);
  };


  const handleNativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setFormError('Please provide your concern or idea details.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await api.submitStudentVoice({
        type: submissionType,
        name: formData.name.trim() || undefined,
        programme: formData.programme.trim() || undefined,
        message: formData.message.trim()
      });
      setSuccess(true);
      setFormData({ name: '', programme: '', message: '' });
    } catch (err: any) {
      setFormError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
            <span>Direct Student Engagement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Student Voice & Feedback Hub
          </h1>
          <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
            Your voice is the foundation of our leadership agenda. Share your priorities, submit anonymous campus concerns, or propose bold new ideas for women on campus.
          </p>
        </div>

        {/* 4 Feedback Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Card 1: Needs Survey */}
          {(() => {
            const survey = surveys.find(s => s.form_name.toLowerCase().includes('needs') || s.form_name.toLowerCase().includes('survey')) || surveys[0];
            const isLive = survey && survey.status === 'live' && survey.url;
            return (
              <div className="campaign-card flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mb-4">
                    <ClipboardList className="w-6 h-6 text-brand-navy" />
                  </div>
                  <h2 className="text-lg font-bold text-brand-navy mb-2">
                    Women's Campus Needs Survey
                  </h2>
                  <p className="text-xs sm:text-sm text-ink/70 leading-relaxed mb-6">
                    A comprehensive survey evaluating academic support, safety, menstrual hygiene amenities, and career mentoring for UPSA women.
                  </p>
                </div>
                <div>
                  {isLive ? (
                    <a
                      href={survey.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold w-full text-xs font-bold py-3 gap-2"
                    >
                      <span>Take the Needs Survey</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button disabled className="btn-navy w-full text-xs font-semibold py-3 opacity-50 cursor-not-allowed">
                      Survey Opening Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Card 2: Quick Poll */}
          {(() => {
            const poll = surveys.find(s => s.form_name.toLowerCase().includes('poll')) || surveys[1];
            const isLive = poll && poll.status === 'live' && poll.url;
            return (
              <div className="campaign-card flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-brand-navy" />
                  </div>
                  <h2 className="text-lg font-bold text-brand-navy mb-2">
                    Weekly Campus Quick Poll
                  </h2>
                  <p className="text-xs sm:text-sm text-ink/70 leading-relaxed mb-6">
                    A 60-second snapshot poll on key campus topics, student facility satisfaction, and welfare priorities.
                  </p>
                </div>
                <div>
                  {isLive ? (
                    <a
                      href={poll.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold w-full text-xs font-bold py-3 gap-2"
                    >
                      <span>Participate in Poll</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button disabled className="btn-navy w-full text-xs font-semibold py-3 opacity-50 cursor-not-allowed">
                      Next Poll Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Card 3: Submit a Concern */}
          <div className="campaign-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-brand-navy" />
              </div>
              <h2 className="text-lg font-bold text-brand-navy mb-2">
                Submit a Concern
              </h2>
              <p className="text-xs sm:text-sm text-ink/70 leading-relaxed mb-6">
                Encountering an issue regarding safety, facilities, or academic welfare? Submit your concern directly to the candidate's desk. Anonymous submissions accepted.
              </p>
            </div>
            <button
              onClick={() => openNativeModal('concern')}
              className="btn-navy w-full text-xs font-bold py-3"
            >
              Submit a Concern
            </button>
          </div>

          {/* Card 4: Suggest an Idea */}
          <div className="campaign-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-brand-navy" />
              </div>
              <h2 className="text-lg font-bold text-brand-navy mb-2">
                Suggest an Idea
              </h2>
              <p className="text-xs sm:text-sm text-ink/70 leading-relaxed mb-6">
                Have an innovative initiative, workshop, or project you want championed by the next Women's Commissioner? Let's co-create the agenda.
              </p>
            </div>
            <button
              onClick={() => openNativeModal('idea')}
              className="btn-gold w-full text-xs font-bold py-3"
            >
              Suggest an Idea
            </button>
          </div>
        </div>

        {/* Modal for Concern / Idea Submission */}
        {modalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-voice-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navyDark/80 animate-in fade-in duration-200"
          >
            <div
              ref={modalRef}
              className="bg-surface rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-ink/50 hover:text-ink hover:bg-muted focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 id="student-voice-modal-title" className="text-xl font-bold text-brand-navy mb-2">
                    Thank You for Speaking Up
                  </h3>
                  <p className="text-sm text-ink/75 leading-relaxed mb-6">
                    Your {submissionType === 'concern' ? 'concern' : 'idea'} has been securely delivered to the candidate and policy research team.
                  </p>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="btn-navy text-xs font-bold py-2.5 px-6"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider mb-1">
                      {submissionType === 'concern' ? 'Confidential Submission' : 'Campaign Co-Creation'}
                    </div>
                    <h3 id="student-voice-modal-title" className="text-xl font-extrabold text-brand-navy">
                      {submissionType === 'concern' ? 'Submit a Campus Concern' : 'Suggest a Campaign Idea'}
                    </h3>
                    <p className="text-xs text-ink/60 mt-1">
                      {submissionType === 'concern'
                        ? 'Name and programme are optional if you prefer complete anonymity.'
                        : 'Share your vision for initiatives or policy recommendations.'}
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleNativeSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="voice-name" className="block text-xs font-bold text-ink mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        id="voice-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Leave blank to stay anonymous"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="voice-programme" className="block text-xs font-bold text-ink mb-1">
                        Programme & Level (Optional)
                      </label>
                      <input
                        id="voice-programme"
                        type="text"
                        value={formData.programme}
                        onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                        placeholder="e.g. BSc Accounting, Level 300"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="voice-message" className="block text-xs font-bold text-ink mb-1">
                        {submissionType === 'concern' ? 'Describe Your Concern *' : 'Describe Your Idea *'}
                      </label>
                      <textarea
                        id="voice-message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          submissionType === 'concern'
                            ? 'Please provide details on the campus challenge or situation...'
                            : 'What program, service, or policy should we implement and why?'
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink/70 hover:bg-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gold text-xs font-bold py-2.5 px-6 gap-2"
                      >
                        {submitting ? (
                          <span>Sending feedback...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{submissionType === 'concern' ? 'Send campus concern' : 'Send campaign idea'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
