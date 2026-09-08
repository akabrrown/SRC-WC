import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { CandidateProfile } from '../types/index.js';

interface SubNavItem {
  name: string;
  path: string;
  description: string;
}

interface NavItem {
  name: string;
  path?: string;
  subItems?: SubNavItem[];
}

interface NavbarProps {
  candidate?: CandidateProfile | null;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'The Candidate',
    subItems: [
      {
        name: 'Meet Candidate',
        path: '/meet-the-candidate',
        description: 'Background, leadership record & purpose'
      },
      {
        name: 'Vision & Promises',
        path: '/my-vision',
        description: 'Core principles, mission & leadership pledges'
      },
      {
        name: 'Voices of Support',
        path: '/voices-of-support',
        description: 'Student endorsements & peer testimonials'
      }
    ]
  },
  {
    name: 'Agenda & Welfare',
    subItems: [
      {
        name: 'Our Agenda',
        path: '/our-agenda',
        description: 'Comprehensive campaign manifesto & pillars'
      },
      {
        name: "Women's Corner",
        path: '/womens-corner',
        description: 'Welfare, safety, amenities & mentorship'
      }
    ]
  },
  {
    name: 'News & Events',
    subItems: [
      {
        name: 'Dispatches & Updates',
        path: '/updates',
        description: 'Campaign releases, media & articles'
      },
      {
        name: 'Townhalls & Events',
        path: '/events',
        description: 'Upcoming student forums & townhall schedule'
      }
    ]
  },
  {
    name: 'Student Voice',
    subItems: [
      {
        name: 'Voice & Feedback Hub',
        path: '/student-voice',
        description: 'Submit campus concerns & suggestions'
      },
      {
        name: 'Frequently Asked Questions',
        path: '/faq',
        description: 'Answers to key student welfare questions'
      }
    ]
  },
  {
    name: 'Contact',
    path: '/contact'
  }
];

export const Navbar: React.FC<NavbarProps> = ({ candidate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileGroups, setExpandedMobileGroups] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns and mobile drawer on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(prev => (prev === itemName ? null : itemName));
  };

  const toggleMobileGroup = (itemName: string) => {
    setExpandedMobileGroups(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isGroupActive = (item: NavItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  const displayName = candidate?.display_name || '[ Candidate Name ]';

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-brand-navy border-b border-brand-navyDark shadow-md">
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-brand-gold focus:text-brand-navyDark focus:font-extrabold focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-navyDark text-xs"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-gold flex items-center justify-center font-bold text-brand-navyDark text-sm sm:text-base shadow-sm">
              SRC
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-brand-gold transition-colors">
                {displayName}
              </span>
              <span className="text-[11px] text-brand-goldLight uppercase tracking-wider font-medium">
                Women's Commissioner Candidate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (6 Core Items) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
            {NAV_ITEMS.map((item, index) => {
              const active = isGroupActive(item);
              const isOpen = activeDropdown === item.name;

              // Simple Direct Link (e.g. Home, Contact)
              if (!item.subItems) {
                return (
                  <Link
                    key={item.name}
                    to={item.path || '/'}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'text-brand-gold bg-brand-navyDark'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }

              // Dropdown Menu Item
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.name)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-controls={`dropdown-menu-${index}`}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      active
                        ? 'text-brand-gold bg-brand-navyDark'
                        : isOpen
                        ? 'text-white bg-white/10'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-gold' : 'text-white/60'
                      }`}
                    />
                  </button>

                  {/* Dropdown Panel */}
                  {isOpen && (
                    <div
                      id={`dropdown-menu-${index}`}
                      role="menu"
                      aria-label={item.name}
                      className="absolute left-0 mt-1 w-64 rounded-xl bg-brand-navyDark border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="space-y-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = location.pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              role="menuitem"
                              onClick={() => setActiveDropdown(null)}
                              className={`group block p-2.5 rounded-lg transition-all ${
                                isSubActive
                                  ? 'bg-brand-navy text-brand-gold border-l-2 border-brand-gold'
                                  : 'hover:bg-white/10 text-white'
                              }`}
                            >
                              <div className="text-xs font-bold leading-tight group-hover:text-brand-gold transition-colors">
                                {subItem.name}
                              </div>
                              <p className="text-[11px] text-white/60 mt-0.5 leading-snug group-hover:text-white/80">
                                {subItem.description}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/join-the-movement"
              className="btn-gold text-xs font-bold py-2 px-4 shadow-sm"
            >
              Join Movement
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-medium px-2.5 py-1.5 rounded border border-white/20 hover:border-white/40 transition-colors"
              title="Campaign Staff CMS Portal"
            >
              <Shield className="w-3.5 h-3.5 text-brand-gold" />
              <span>CMS</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/join-the-movement"
              className="btn-gold text-xs py-1.5 px-3 sm:hidden"
            >
              Join
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-navyDark border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isGroupActive(item);

              // Single link
              if (!item.subItems) {
                return (
                  <Link
                    key={item.name}
                    to={item.path || '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand-navy text-brand-gold font-bold'
                        : 'text-white/90 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </Link>
                );
              }

              // Accordion Group
              const isExpanded = expandedMobileGroups[item.name] ?? active;

              return (
                <div key={item.name} className="rounded-lg border border-white/5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(item.name)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand-navy text-brand-gold font-bold'
                        : 'text-white/90 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-brand-gold' : 'text-white/40'
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="bg-black/20 p-2 space-y-1 border-t border-white/5">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block p-2 rounded-md transition-colors ${
                              isSubActive
                                ? 'bg-brand-navy text-brand-gold font-semibold'
                                : 'text-white/80 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-semibold">{subItem.name}</div>
                            <div className="text-[10px] text-white/50">{subItem.description}</div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <Link
              to="/join-the-movement"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-gold w-full text-center text-sm py-3 justify-center"
            >
              Join the Movement
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-outline-white w-full text-center text-xs py-2.5 justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-brand-gold" />
              Staff CMS Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
