import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { api } from './api/client.js';
import { CandidateProfile, ContactChannels, SocialLink } from './types/index.js';

// Public Pages
import { Home } from './pages/public/Home.js';
import { MeetCandidate } from './pages/public/MeetCandidate.js';
import { MyVision } from './pages/public/MyVision.js';
import { OurAgenda } from './pages/public/OurAgenda.js';
import { WomensCorner } from './pages/public/WomensCorner.js';
import { Updates } from './pages/public/Updates.js';
import { UpdateDetail } from './pages/public/UpdateDetail.js';
import { Events } from './pages/public/Events.js';
import { StudentVoice } from './pages/public/StudentVoice.js';
import { JoinMovement } from './pages/public/JoinMovement.js';
import { VoicesOfSupport } from './pages/public/VoicesOfSupport.js';
import { FAQ } from './pages/public/FAQ.js';
import { Contact } from './pages/public/Contact.js';

// Admin CMS Pages
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { Dashboard } from './pages/admin/Dashboard.js';
import { CandidateProfileCMS } from './pages/admin/CandidateProfileCMS.js';
import { VisionEditorCMS } from './pages/admin/VisionEditorCMS.js';
import { BrandingSettingsCMS } from './pages/admin/BrandingSettingsCMS.js';
import { LaunchSettingsCMS } from './pages/admin/LaunchSettingsCMS.js';
import { PolicyHubCMS } from './pages/admin/PolicyHubCMS.js';
import { WomensCornerCMS } from './pages/admin/WomensCornerCMS.js';
import { UpdatesCMS } from './pages/admin/UpdatesCMS.js';
import { EventsCMS } from './pages/admin/EventsCMS.js';
import { StudentVoiceCMS } from './pages/admin/StudentVoiceCMS.js';
import { VolunteersCMS } from './pages/admin/VolunteersCMS.js';
import { TestimonialsCMS } from './pages/admin/TestimonialsCMS.js';
import { FAQCMS } from './pages/admin/FAQCMS.js';
import { MediaGalleryCMS } from './pages/admin/MediaGalleryCMS.js';
import { ContactInboxCMS } from './pages/admin/ContactInboxCMS.js';
import { UsersPermissionsCMS } from './pages/admin/UsersPermissionsCMS.js';
import { AuditLogCMS } from './pages/admin/AuditLogCMS.js';

import { ToastProvider } from './context/ToastContext.js';
import { WifiOff } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="bg-amber-900 text-amber-100 text-xs py-2 px-4 text-center font-medium sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-amber-700 shadow-md"
    >
      <WifiOff className="w-4 h-4 text-amber-300 animate-pulse" />
      <span>You are currently offline. Changes cannot be saved until connectivity is restored.</span>
    </div>
  );
}

function PublicLayout() {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [channels, setChannels] = useState<ContactChannels | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    async function loadShellData() {
      try {
        const [cand, chan, soc] = await Promise.all([
          api.getCandidateProfile(),
          api.getContactChannels(),
          api.getSocialLinks()
        ]);
        setCandidate(cand);
        setChannels(chan);
        setSocials(soc);
      } catch (err) {
        console.error('Failed to load shell identity data', err);
      }
    }
    loadShellData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar candidate={candidate} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer candidate={candidate} channels={channels} socials={socials} />
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <OfflineBanner />
      <ScrollToTop />
      <Routes>
        {/* Public Campaign Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/meet-the-candidate" element={<MeetCandidate />} />
          <Route path="/my-vision" element={<MyVision />} />
          <Route path="/our-agenda" element={<OurAgenda />} />
          <Route path="/womens-corner" element={<WomensCorner />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/updates/:id" element={<UpdateDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/student-voice" element={<StudentVoice />} />
          <Route path="/join-the-movement" element={<JoinMovement />} />
          <Route path="/voices-of-support" element={<VoicesOfSupport />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin CMS Pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="candidate" element={<CandidateProfileCMS />} />
          <Route path="vision" element={<VisionEditorCMS />} />
          <Route path="branding" element={<BrandingSettingsCMS />} />
          <Route path="launch-settings" element={<LaunchSettingsCMS />} />
          <Route path="policies" element={<PolicyHubCMS />} />
          <Route path="womens-corner" element={<WomensCornerCMS />} />
          <Route path="updates" element={<UpdatesCMS />} />
          <Route path="events" element={<EventsCMS />} />
          <Route path="student-voice" element={<StudentVoiceCMS />} />
          <Route path="volunteers" element={<VolunteersCMS />} />
          <Route path="testimonials" element={<TestimonialsCMS />} />
          <Route path="faq" element={<FAQCMS />} />
          <Route path="media" element={<MediaGalleryCMS />} />
          <Route path="contact" element={<ContactInboxCMS />} />
          <Route path="users" element={<UsersPermissionsCMS />} />
          <Route path="audit-log" element={<AuditLogCMS />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
};
export default App;

