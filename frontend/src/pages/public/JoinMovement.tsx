import React, { useState } from 'react';
import { Users, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { api } from '../../api/client.js';
import { RegistrationType } from '../../types/index.js';

const ROLES: { id: RegistrationType; title: string; desc: string }[] = [
  { id: 'volunteer', title: 'Campus Volunteer', desc: 'Assist with day-to-day outreach, flyers, and event support' },
  { id: 'campaign_team', title: 'Campaign Team', desc: 'Core organizing roles in logistics, strategy, and media' },
  { id: 'ambassador', title: 'Hall / Class Ambassador', desc: 'Represent the campaign within your hostel, hall, or lecture group' },
  { id: 'supporter', title: 'General Supporter', desc: 'Stay updated, amplify messaging, and vote on election day' }
];

const INTEREST_AREAS = [
  'Event Planning & Logistics',
  'Graphic Design & Creative Media',
  'Photography & Video Production',
  'Social Media & Digital Outreach',
  'Hostel & Hall Ground Campaigning',
  'Student Welfare Research & Policy',
  'Public Speaking & Debate Support'
];

const AVAILABILITY_OPTIONS = [
  'Full Time (Most Days)',
  'Part Time (After Classes)',
  'Weekends Only',
  'Event Days Only',
  'Flexible / Remote Support'
];

export const JoinMovement: React.FC = () => {
  const [role, setRole] = useState<RegistrationType>('volunteer');
  const [formData, setFormData] = useState({
    fullName: '',
    programme: '',
    level: '100',
    phone: '',
    email: '',
    areaOfInterest: INTEREST_AREAS[0],
    skills: '',
    availability: AVAILABILITY_OPTIONS[0],
    motivation: ''
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.programme || !formData.phone || !formData.email) {
      setError('Please fill in all required contact and academic fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitVolunteer({
        full_name: formData.fullName.trim(),
        programme: formData.programme.trim(),
        level: formData.level,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        area_of_interest: formData.areaOfInterest,
        skills: formData.skills.trim() || undefined,
        availability: formData.availability,
        motivation: formData.motivation.trim() || undefined,
        registration_type: role
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your details and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-brand-gold" />
            <span>Be Part of the Change</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Join the Movement
          </h1>
          <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
            Real student representation is built from the ground up. Lend your skills, energy, and voice to build an inclusive, supportive campus for all students.
          </p>
        </div>

        {success ? (
          <div className="campaign-card text-center p-10 sm:p-14 max-w-xl mx-auto border-emerald-200 bg-emerald-50/40 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-3">
              Welcome to the Campaign Team
            </h2>
            <p className="text-sm text-ink/75 leading-relaxed mb-8">
              Thank you for signing up as a <strong>{ROLES.find(r => r.id === role)?.title}</strong>. Our mobilization lead will contact you via WhatsApp and email with onboarding materials and meeting dates.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  fullName: '',
                  programme: '',
                  level: '100',
                  phone: '',
                  email: '',
                  areaOfInterest: INTEREST_AREAS[0],
                  skills: '',
                  availability: AVAILABILITY_OPTIONS[0],
                  motivation: ''
                });
              }}
              className="btn-navy text-xs font-bold py-3 px-8"
            >
              Register Another Supporter
            </button>
          </div>
        ) : (
          <div className="campaign-card">
            {/* Role Selector */}
            <div className="mb-8">
              <label id="role-selector-label" className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                1. Select How You'd Like to Participate
              </label>
              <div
                role="radiogroup"
                aria-labelledby="role-selector-label"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {ROLES.map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setRole(r.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-gold bg-brand-gold/10 ring-1 ring-brand-gold'
                          : 'border-border bg-white hover:border-brand-navy/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold ${isSelected ? 'text-brand-navy' : 'text-ink'}`}>
                          {r.title}
                        </span>
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-gold bg-brand-gold' : 'border-border'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-navy" />}
                        </span>
                      </div>
                      <span className="text-[11px] text-ink/65 leading-normal">
                        {r.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Registration Form */}
            {error && (
              <div className="p-3.5 mb-6 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-2 mb-4">
                2. Your Contact & Academic Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="volunteer-fullName" className="block text-xs font-bold text-ink mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="volunteer-fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Abena Mensah"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="volunteer-phone" className="block text-xs font-bold text-ink mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="volunteer-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0244 000 000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="volunteer-email" className="block text-xs font-bold text-ink mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="volunteer-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. student@upsamail.edu.gh"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="volunteer-level" className="block text-xs font-bold text-ink mb-1.5">
                    Academic Level *
                  </label>
                  <select
                    id="volunteer-level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                  >
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="volunteer-programme" className="block text-xs font-bold text-ink mb-1.5">
                  Academic Programme *
                </label>
                <input
                  id="volunteer-programme"
                  type="text"
                  required
                  value={formData.programme}
                  onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                  placeholder="e.g. BSc Business Administration (Marketing)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-brand-navy border-b border-border pb-2 pt-3 mb-4">
                3. Skills & Availability
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="volunteer-areaOfInterest" className="block text-xs font-bold text-ink mb-1.5">
                    Primary Area of Interest *
                  </label>
                  <select
                    id="volunteer-areaOfInterest"
                    value={formData.areaOfInterest}
                    onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                  >
                    {INTEREST_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="volunteer-availability" className="block text-xs font-bold text-ink mb-1.5">
                    Availability *
                  </label>
                  <select
                    id="volunteer-availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white"
                  >
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="volunteer-skills" className="block text-xs font-bold text-ink mb-1.5">
                  Specific Skills (Optional)
                </label>
                <textarea
                  id="volunteer-skills"
                  rows={2}
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Graphic design, copywriting, event MCing, video editing, campus coordination..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
                />
              </div>

              <div>
                <label htmlFor="volunteer-motivation" className="block text-xs font-bold text-ink mb-1.5">
                  Why do you want to join this campaign? (Optional)
                </label>
                <textarea
                  id="volunteer-motivation"
                  rows={3}
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Share a short note on what drives your passion for campus student leadership..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm focus:border-brand-gold bg-white resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full text-sm font-bold py-3.5 gap-2"
                >
                  {submitting ? (
                    <span>Registering volunteer profile...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Register as volunteer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
