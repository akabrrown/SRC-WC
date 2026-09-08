import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { api } from '../../api/client.js';
import { FAQItem, FAQCategory } from '../../types/index.js';
import { LoadingState, ErrorState, EmptyState } from '../../components/StateView.js';

const FAQ_CATEGORIES: FAQCategory[] = [
  'About the Candidate',
  'Why She Is Contesting',
  "Role of the SRC Women's Commissioner",
  'Campaign Agenda',
  'How Policies Will Be Implemented',
  'How Students Can Participate',
  'How to Contact the Candidate'
];

export const FAQ: React.FC = () => {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFAQ();
      setItems(data);
      if (data.length > 0) {
        setOpenId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load FAQ list.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-gold" />
            <span>Transparency & Answers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-ink/75 leading-relaxed">
            Direct, clear answers regarding the candidate's vision, constitutional duties of the Women's Commissioner, and how student feedback shapes our platform.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="w-4 h-4 text-ink/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white text-sm focus:border-brand-gold shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`text-xs font-bold px-3.5 py-2 rounded-full whitespace-nowrap transition-colors min-h-[38px] ${
              activeCategory === 'all'
                ? 'bg-brand-navy text-brand-gold shadow-sm'
                : 'bg-white border border-border text-ink hover:border-brand-navy'
            }`}
          >
            All Questions
          </button>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold px-3.5 py-2 rounded-full whitespace-nowrap transition-colors min-h-[38px] ${
                activeCategory === cat
                  ? 'bg-brand-navy text-brand-gold shadow-sm'
                  : 'bg-white border border-border text-ink hover:border-brand-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState message="Loading questions and answers..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFAQ} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="No Matching Questions"
            message="No FAQ items matched your search filter. Try adjusting your keywords or category selection."
          />
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="campaign-card !p-0 overflow-hidden transition-all duration-200"
                >
                  <button
                    id={`faq-btn-${item.id}`}
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-brand-navy leading-snug">
                        {item.question}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-brand-gold/20 text-brand-gold' : 'text-brand-navy'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                      className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-ink/75 leading-relaxed border-t border-border pt-4 bg-muted/10 animate-in fade-in duration-150"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

