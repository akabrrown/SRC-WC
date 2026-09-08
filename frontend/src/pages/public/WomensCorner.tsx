import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, BookOpen, Award, HeartHandshake, Shield, LifeBuoy, ArrowRight } from 'lucide-react';
import { api } from '../../api/client.js';
import { WomensCornerSection } from '../../types/index.js';
import { LoadingState } from '../../components/StateView.js';

export const WomensCorner: React.FC = () => {
  const [sections, setSections] = useState<WomensCornerSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSections() {
      try {
        const sectionsData = await api.getWomensCornerSections();
        setSections(sectionsData);
      } catch (err) {
        console.error('Failed to load women corner sections', err);
      } finally {
        setLoading(false);
      }
    }
    loadSections();
  }, []);

  if (loading) {
    return <LoadingState message="Loading Women's Corner..." />;
  }

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'alertcircle':
      case 'issue':
        return <AlertCircle className="w-6 h-6 text-brand-gold flex-shrink-0" />;
      case 'opportunity':
        return <Award className="w-6 h-6 text-brand-gold flex-shrink-0" />;
      case 'bookopen':
      case 'resource':
        return <BookOpen className="w-6 h-6 text-brand-gold flex-shrink-0" />;
      default:
        return <HeartHandshake className="w-6 h-6 text-brand-gold flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-surface py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
            Dedicated Welfare & Growth
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
            Women's Corner
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 max-w-xl mx-auto leading-relaxed">
            A dedicated sanctuary and resource hub addressing issues, opportunities, practical toolkits, and confidential support mechanisms for every female student at UPSA.
          </p>
          <div className="w-12 h-1 bg-brand-gold mx-auto rounded" />
        </div>

        {/* 4 Alternating Full-Width Sections */}
        <div className="space-y-6">
          {sections.map((sec, index) => {
            const isAlt = index % 2 === 1;
            return (
              <div
                key={sec.id}
                className={`rounded-2xl p-6 sm:p-8 border transition-all ${
                  isAlt
                    ? 'bg-muted/70 border-border'
                    : 'bg-white border-border shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-brand-navy/5 border border-brand-gold/20 flex-shrink-0">
                    {getIcon(sec.icon)}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-bold text-brand-navy">
                        {sec.title}
                      </h2>
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-brand-navy px-2.5 py-0.5 rounded text-white">
                        Pillar 0{index + 1}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support & Outreach Callout */}
        <div className="bg-brand-navy text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold">
              Need Confidential Assistance or Advice?
            </h3>
            <p className="text-xs text-white/75 max-w-md">
              The campaign team maintains safe, discreet channels to hear your experiences and connect you with campus support resources.
            </p>
          </div>
          <Link
            to="/contact"
            className="btn-gold text-xs font-bold py-3 px-6 whitespace-nowrap"
          >
            Reach Out Confidentially
          </Link>
        </div>

      </div>
    </div>
  );
};
