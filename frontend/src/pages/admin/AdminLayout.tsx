import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Eye,
  Settings,
  BookOpen,
  Heart,
  Newspaper,
  Calendar,
  MessageSquare,
  Users,
  Quote,
  HelpCircle,
  Image,
  Inbox,
  ShieldAlert,
  History,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Lock
} from 'lucide-react';
import { api } from '../../api/client.js';
import { AdminUser, PermissionScope } from '../../types/index.js';

import { useToast } from '../../context/ToastContext.js';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  requiredScope?: PermissionScope;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Candidate Profile', path: '/admin/candidate', icon: User, requiredScope: 'manage_identity' },
  { name: 'Vision & Values', path: '/admin/vision', icon: Eye, requiredScope: 'manage_identity' },
  { name: 'Launch & Settings', path: '/admin/launch-settings', icon: Settings, requiredScope: 'manage_settings' },
  { name: 'Policy Hub', path: '/admin/policies', icon: BookOpen, requiredScope: 'manage_policy' },
  { name: "Women's Corner", path: '/admin/womens-corner', icon: Heart, requiredScope: 'manage_identity' },
  { name: 'Campaign Updates', path: '/admin/updates', icon: Newspaper, requiredScope: 'manage_updates' },
  { name: 'Events Manager', path: '/admin/events', icon: Calendar, requiredScope: 'manage_events' },
  { name: 'Student Voice Inbox', path: '/admin/student-voice', icon: MessageSquare, requiredScope: 'manage_voice' },
  { name: 'Volunteers (Movement)', path: '/admin/volunteers', icon: Users, requiredScope: 'manage_volunteers' },
  { name: 'Voices of Support', path: '/admin/testimonials', icon: Quote, requiredScope: 'manage_identity' },
  { name: 'FAQ Manager', path: '/admin/faq', icon: HelpCircle, requiredScope: 'manage_voice' },
  { name: 'Media Gallery', path: '/admin/media', icon: Image, requiredScope: 'manage_media' },
  { name: 'Contact Inbox', path: '/admin/contact', icon: Inbox, requiredScope: 'manage_voice' },
  { name: 'Users & Permissions', path: '/admin/users', icon: ShieldAlert, requiredScope: 'manage_users' },
  { name: 'Audit Log', path: '/admin/audit-log', icon: History }
];

export const AdminLayout: React.FC = () => {
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await api.getAdminUsers();
      setAdminUsers(users);
      if (users.length > 0) {
        const initial = users[0];
        setCurrentAdmin(initial);
        api.setAdminId(initial.id);
      }
    } catch {
      // Fallback
    }
  };

  const handleSwitchAdmin = (user: AdminUser) => {
    setCurrentAdmin(user);
    api.setAdminId(user.id);
    setUserDropdownOpen(false);
    toast.info(`Switched Active User`, `Now logged in as ${user.name} (${user.role_label})`);
  };

  const hasAccess = (scope?: PermissionScope): boolean => {
    if (!scope) return true;
    if (!currentAdmin) return true;
    return currentAdmin.permission_scope.includes(scope);
  };

  const currentNavItem = NAV_ITEMS.find((n) => n.path === location.pathname);
  const isRouteAllowed = !currentNavItem?.requiredScope || hasAccess(currentNavItem.requiredScope);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-ink flex flex-col md:flex-row">
      {/* Skip to Admin Content */}
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-brand-navy text-brand-gold px-4 py-2 rounded-lg font-bold shadow-lg ring-2 ring-brand-gold"
      >
        Skip to main admin content
      </a>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-brand-navyDark text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-brand-gold text-brand-navyDark font-extrabold flex items-center justify-center text-xs">
            SRC
          </div>
          <div>
            <h1 className="text-xs font-bold text-white">Staff CMS</h1>
            <span className="text-[10px] text-brand-gold font-medium">{currentAdmin?.role_label || 'Admin'}</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Left 240px Navy-Dark Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-brand-navyDark text-white z-50 flex flex-col justify-between border-r border-white/10 transition-transform duration-200 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-gold flex items-center justify-center font-black text-brand-navyDark text-sm shadow-sm">
                SRC
              </div>
              <div>
                <span className="text-sm font-extrabold text-white tracking-tight block leading-tight">
                  Campaign CMS
                </span>
                <span className="text-[10px] text-brand-gold uppercase tracking-widest font-semibold">
                  Management Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((navItem) => {
              const isActive = location.pathname === navItem.path;
              const allowed = hasAccess(navItem.requiredScope);
              return (
                <Link
                  key={navItem.path}
                  to={allowed ? navItem.path : '#'}
                  onClick={(e) => {
                    if (!allowed) {
                      e.preventDefault();
                      toast.warning('Access Restricted', `Requires permission scope: "${navItem.requiredScope}"`);
                    } else {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors group ${
                    isActive
                      ? 'bg-brand-navy text-brand-gold border-l-4 border-brand-gold'
                      : allowed
                      ? 'text-white/80 hover:text-white hover:bg-white/5'
                      : 'text-white/30 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <navItem.icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-brand-gold' : allowed ? 'text-white/60 group-hover:text-white' : 'text-white/20'
                      }`}
                    />
                    <span className="truncate">{navItem.name}</span>
                  </div>
                  {!allowed && <Lock className="w-3 h-3 text-white/30 flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Public Site Link */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/90 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
          </Link>
          <div className="text-[10px] text-white/40 text-center">
            UPSA Women's Commissioner &copy; {new Date().getFullYear()}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar */}
        <header className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
              Admin Portal
            </span>
            <h1 className="text-base sm:text-lg font-extrabold text-brand-navy truncate">
              {currentNavItem?.name || 'Control Centre'}
            </h1>
          </div>

          {/* User Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 p-1.5 pl-3 rounded-xl border border-border hover:border-brand-navy/30 bg-muted/40 transition-colors focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-brand-navy block leading-tight">
                  {currentAdmin?.name || 'Admin User'}
                </span>
                <span className="text-[10px] text-brand-goldDark font-semibold">
                  {currentAdmin?.role_label || 'Administrator'}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-brand-navy text-brand-gold font-bold text-xs flex items-center justify-center">
                {currentAdmin?.name ? currentAdmin.name.charAt(0) : 'A'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-ink/50" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-xl border border-border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <span className="text-[10px] uppercase font-bold text-ink/50 tracking-wider block">
                    Switch Active Staff Account
                  </span>
                </div>
                <div className="space-y-1">
                  {adminUsers.map((userAccount) => {
                    const isSelected = currentAdmin?.id === userAccount.id;
                    return (
                      <button
                        key={userAccount.id}
                        onClick={() => handleSwitchAdmin(userAccount)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col ${
                          isSelected ? 'bg-brand-navy text-white' : 'hover:bg-muted text-ink'
                        }`}
                      >
                        <span className="font-bold">{userAccount.name}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-brand-gold' : 'text-ink/60'}`}>
                          {userAccount.role_label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Outlet with Route Scope Guard */}
        <main id="admin-main-content" tabIndex={-1} className="p-4 sm:p-6 lg:p-8 flex-1 outline-none">
          {isRouteAllowed ? (
            <Outlet />
          ) : (
            <div className="campaign-card text-center p-12 max-w-lg mx-auto my-12 border-amber-200 bg-amber-50/50">
              <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-brand-navy mb-2">Access Restricted</h2>
              <p className="text-xs sm:text-sm text-ink/75 mb-6 leading-relaxed">
                Your active role (<strong>{currentAdmin?.role_label}</strong>) lacks the <code>{currentNavItem?.requiredScope}</code> permission scope required to manage this section.
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/admin" className="btn-navy text-xs py-2.5 px-6">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
