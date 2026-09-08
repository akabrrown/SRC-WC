import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageSquare, Shield, ExternalLink, MapPin } from 'lucide-react';
import { CandidateProfile, ContactChannels, SocialLink } from '../types/index.js';

interface FooterProps {
  candidate?: CandidateProfile | null;
  channels?: ContactChannels | null;
  socials?: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({ candidate, channels, socials = [] }) => {
  const whatsappUrl = channels?.whatsapp_number 
    ? `https://wa.me/${channels.whatsapp_number.replace(/[^0-9]/g, '')}` 
    : undefined;
  const telUrl = channels?.phone_number ? `tel:${channels.phone_number}` : undefined;
  const mailUrl = channels?.email ? `mailto:${channels.email}` : undefined;

  return (
    <footer className="bg-brand-navyDark text-white border-t-4 border-brand-gold mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Campaign Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center font-extrabold text-brand-navyDark text-lg shadow-sm">
                SRC
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {candidate?.display_name || '[ Candidate Full Name ]'}
                </h3>
                <p className="text-xs text-brand-goldLight font-medium">
                  SRC Women's Commissioner Candidate
                </p>
              </div>
            </div>
            
            <p className="text-xs text-white/75 leading-relaxed">
              {candidate?.slogan ? `"${candidate.slogan}"` : '"A purposeful leadership dedicated to equity, empowerment, and student advocacy."'}
            </p>

            <div className="flex items-start gap-2 text-xs text-white/70 pt-2">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
              <span>{channels?.office_location || 'University of Professional Studies, Accra (UPSA)'}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-4">
              Explore Campaign
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link to="/meet-the-candidate" className="hover:text-brand-gold transition-colors">
                  Meet the Candidate
                </Link>
              </li>
              <li>
                <Link to="/my-vision" className="hover:text-brand-gold transition-colors">
                  My Vision & Values
                </Link>
              </li>
              <li>
                <Link to="/our-agenda" className="hover:text-brand-gold transition-colors flex items-center gap-1.5">
                  <span>Our Agenda</span>
                  <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded font-bold">Teaser</span>
                </Link>
              </li>
              <li>
                <Link to="/womens-corner" className="hover:text-brand-gold transition-colors">
                  Women's Corner
                </Link>
              </li>
              <li>
                <Link to="/updates" className="hover:text-brand-gold transition-colors">
                  Campaign Updates
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-brand-gold transition-colors">
                  Campus Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Engagement & Voice */}
          <div>
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-4">
              Get Involved
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link to="/join-the-movement" className="hover:text-brand-gold transition-colors font-semibold text-white">
                  Volunteer & Join Campaign
                </Link>
              </li>
              <li>
                <Link to="/student-voice" className="hover:text-brand-gold transition-colors">
                  Student Voice & Surveys
                </Link>
              </li>
              <li>
                <Link to="/voices-of-support" className="hover:text-brand-gold transition-colors">
                  Voices of Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-gold transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Channels */}
          <div>
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="space-y-2.5">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-white/90 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 p-2.5 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Community</span>
                </a>
              ) : (
                <div className="flex items-center gap-2.5 text-xs text-white/40 bg-white/5 border border-white/10 p-2.5 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-white/30" />
                  <span>WhatsApp: Coming Soon</span>
                </div>
              )}

              {telUrl ? (
                <a
                  href={telUrl}
                  className="flex items-center gap-2.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 p-2.5 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span>{channels?.phone_number}</span>
                </a>
              ) : null}

              {mailUrl ? (
                <a
                  href={mailUrl}
                  className="flex items-center gap-2.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 p-2.5 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-gold" />
                  <span className="truncate">{channels?.email}</span>
                </a>
              ) : null}
            </div>

            {/* Social Links Row */}
            {socials.length > 0 && (
              <div className="pt-4 flex flex-wrap gap-2">
                {socials.filter(s => s.visible && s.url).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-brand-gold bg-brand-navy px-2.5 py-1 rounded border border-brand-gold/30 hover:border-brand-gold transition-colors flex items-center gap-1"
                  >
                    <span>{s.platform}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>
            &copy; {new Date().getFullYear()} SRC Women's Commissioner Campaign. Affiliated with UPSA.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-white transition-colors">
              Privacy & Inquiries
            </Link>
            <span>•</span>
            <Link to="/admin" className="flex items-center gap-1 text-brand-gold hover:text-white transition-colors font-medium">
              <Shield className="w-3.5 h-3.5" />
              Staff CMS Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
