import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../api/client.js';
import { ContactChannels } from '../../types/index.js';

const ENQUIRY_CATEGORIES = [
  'General Campaign Enquiry',
  'Student Welfare & Needs',
  'Hostel / Hall Visit Request',
  'Volunteer & Team Enquiries',
  'Media & Speaking Invitation',
  'Policy Suggestion'
];

export const Contact: React.FC = () => {
  const [channels, setChannels] = useState<ContactChannels | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    programme: '',
    contact: '',
    enquiryCategory: ENQUIRY_CATEGORIES[0],
    message: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const channelsData = await api.getContactChannels();
      setChannels(channelsData);
    } catch {
      // Graceful fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) {
      setError('Please fill in your name, contact information, and message.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitContact({
        name: formData.name.trim(),
        programme: formData.programme.trim() || 'General Student',
        contact: formData.contact.trim(),
        enquiry_category: formData.enquiryCategory,
        message: formData.message.trim()
      });
      setSuccess(true);
      setFormData({
        name: '',
        programme: '',
        contact: '',
        enquiryCategory: ENQUIRY_CATEGORIES[0],
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = channels?.whatsapp_number
    ? `https://wa.me/${channels.whatsapp_number.replace(/[^0-9]/g, '')}`
    : undefined;
  const telUrl = channels?.phone_number ? `tel:${channels.phone_number}` : undefined;
  const mailUrl = channels?.email ? `mailto:${channels.email}` : undefined;

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5 text-brand-gold" />
            <span>Open Communication</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
            Have questions for the candidate, need assistance, or want to invite us to your lecture hall or hostel? We are always reachable.
          </p>
        </div>

        {/* 3 Large Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex flex-col items-center justify-center p-6 text-center rounded-xl shadow-sm hover:scale-[1.02] transition-transform"
            >
              <MessageSquare className="w-7 h-7 mb-2 text-brand-navyDark" />
              <span className="text-sm font-extrabold text-brand-navyDark">Chat on WhatsApp</span>
              <span className="text-xs text-brand-navyDark/80 mt-1 font-medium">Instant Response</span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-muted/60 border border-border">
              <MessageSquare className="w-7 h-7 mb-2 text-ink/40" />
              <span className="text-sm font-bold text-ink/50">WhatsApp</span>
              <span className="text-xs text-ink/40 mt-1">Coming Soon</span>
            </div>
          )}

          {telUrl ? (
            <a
              href={telUrl}
              className="btn-outline-navy flex flex-col items-center justify-center p-6 text-center rounded-xl hover:bg-brand-navy hover:text-white transition-all shadow-sm"
            >
              <Phone className="w-7 h-7 mb-2 text-brand-gold" />
              <span className="text-sm font-bold">Direct Phone Call</span>
              <span className="text-xs text-ink/60 mt-1">{channels?.phone_number}</span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-muted/60 border border-border">
              <Phone className="w-7 h-7 mb-2 text-ink/40" />
              <span className="text-sm font-bold text-ink/50">Direct Line</span>
              <span className="text-xs text-ink/40 mt-1">Pending Confirmation</span>
            </div>
          )}

          {mailUrl ? (
            <a
              href={mailUrl}
              className="btn-outline-navy flex flex-col items-center justify-center p-6 text-center rounded-xl hover:bg-brand-navy hover:text-white transition-all shadow-sm"
            >
              <Mail className="w-7 h-7 mb-2 text-brand-gold" />
              <span className="text-sm font-bold">Official Email</span>
              <span className="text-xs text-ink/60 mt-1 truncate max-w-full px-2">{channels?.email}</span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-muted/60 border border-border">
              <Mail className="w-7 h-7 mb-2 text-ink/40" />
              <span className="text-sm font-bold text-ink/50">Official Email</span>
              <span className="text-xs text-ink/40 mt-1">Pending Confirmation</span>
            </div>
          )}
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Info Column */}
          <div className="space-y-6">
            <div className="campaign-card bg-muted/30">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Campaign Secretariat</span>
              </div>
              <p className="text-xs sm:text-sm text-ink/75 leading-relaxed mb-4">
                {channels?.office_location || 'University of Professional Studies, Accra (UPSA), Legon.'}
              </p>
              <div className="text-xs text-ink/60 space-y-1">
                <p>• Working Hours: 8:00 AM – 6:00 PM</p>
                <p>• Response Time: Within 24 hours</p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-brand-gold/30 bg-brand-gold/5">
              <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Confidentiality Notice
              </h4>
              <p className="text-xs text-ink/70 leading-relaxed">
                All inquiries and welfare communications are handled with strict privacy and shared only with authorized campaign liaisons.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-2">
            <div className="campaign-card">
              <h2 className="text-lg font-bold text-brand-navy mb-1">
                Send a Direct Message
              </h2>
              <p className="text-xs text-ink/60 mb-6">
                Fill out the form below and our secretariat will reach out promptly.
              </p>

              {success ? (
                <div className="p-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-200 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-brand-navy mb-1">
                    Message Successfully Delivered
                  </h3>
                  <p className="text-xs text-ink/70 mb-4">
                    Thank you for reaching out. We have logged your enquiry in our secretariat inbox.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-navy text-xs py-2 px-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold text-ink mb-1">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ama Serwaa"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-programme" className="block text-xs font-bold text-ink mb-1">
                        Programme / Dept (Optional)
                      </label>
                      <input
                        id="contact-programme"
                        type="text"
                        value={formData.programme}
                        onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                        placeholder="e.g. Law Faculty, Level 200"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-contact" className="block text-xs font-bold text-ink mb-1">
                        Phone / Email Contact *
                      </label>
                      <input
                        id="contact-contact"
                        type="text"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        placeholder="e.g. 0244 123 456 or name@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-enquiryCategory" className="block text-xs font-bold text-ink mb-1">
                        Enquiry Category *
                      </label>
                      <select
                        id="contact-enquiryCategory"
                        value={formData.enquiryCategory}
                        onChange={(e) => setFormData({ ...formData, enquiryCategory: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                      >
                        {ENQUIRY_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-ink mb-1">
                      Your Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist or collaborate with you?"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold w-full text-xs font-bold py-3 gap-2"
                    >
                      {submitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
