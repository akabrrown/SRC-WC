import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  CandidateProfile, 
  SiteSettings, 
  VisionContent, 
  BrandAssets, 
  ContactChannels, 
  CampaignValue, 
  LeadershipPromise, 
  SocialLink, 
  SurveyLink, 
  WomensCornerSection, 
  CampaignUpdate, 
  CampaignEvent, 
  Testimonial, 
  FAQItem, 
  MediaItem, 
  PolicyItem, 
  ContactSubmission, 
  StudentVoiceSubmission, 
  VolunteerRegistration, 
  AdminUser, 
  AuditLogEntry 
} from '../types/index.js';
import { getInitialSeedData } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'campaign_data.json');

export interface DatabaseState {
  candidateProfile: CandidateProfile;
  siteSettings: SiteSettings;
  visionContent: VisionContent;
  brandAssets: BrandAssets;
  contactChannels: ContactChannels;
  values: CampaignValue[];
  promises: LeadershipPromise[];
  socialLinks: SocialLink[];
  surveyLinks: SurveyLink[];
  womensCornerSections: WomensCornerSection[];
  updates: CampaignUpdate[];
  events: CampaignEvent[];
  testimonials: Testimonial[];
  faqItems: FAQItem[];
  mediaGallery: MediaItem[];
  policyItems: PolicyItem[];
  contactSubmissions: ContactSubmission[];
  studentVoiceSubmissions: StudentVoiceSubmission[];
  volunteerRegistrations: VolunteerRegistration[];
  adminUsers: AdminUser[];
  auditLogs: AuditLogEntry[];
}

class CampaignDatabase {
  private state: DatabaseState;

  constructor() {
    this.ensureDataDir();
    this.state = this.loadOrSeed();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadOrSeed(): DatabaseState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing database file, re-seeding:', err);
    }
    const seed = getInitialSeedData();
    this.saveState(seed);
    return seed;
  }

  private saveState(state: DatabaseState) {
    this.ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  }

  private persist() {
    this.saveState(this.state);
  }

  // Get current state snapshot
  public getState(): DatabaseState {
    return this.state;
  }

  // Candidate Profile
  public getCandidateProfile(): CandidateProfile {
    return this.state.candidateProfile;
  }
  public updateCandidateProfile(updates: Partial<CandidateProfile>): CandidateProfile {
    this.state.candidateProfile = {
      ...this.state.candidateProfile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.candidateProfile;
  }

  // Site Settings
  public getSiteSettings(): SiteSettings {
    return this.state.siteSettings;
  }
  public updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.state.siteSettings = {
      ...this.state.siteSettings,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.siteSettings;
  }

  // Vision & Values
  public getVisionContent(): VisionContent {
    return this.state.visionContent;
  }
  public updateVisionContent(updates: Partial<VisionContent>): VisionContent {
    this.state.visionContent = {
      ...this.state.visionContent,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.visionContent;
  }

  public getValues(): CampaignValue[] {
    return [...this.state.values].sort((a, b) => a.sort_order - b.sort_order);
  }
  public updateValues(newValues: CampaignValue[]): CampaignValue[] {
    this.state.values = newValues;
    this.persist();
    return this.state.values;
  }

  public getPromises(): LeadershipPromise[] {
    return [...this.state.promises].sort((a, b) => a.sort_order - b.sort_order);
  }

  // Brand Assets
  public getBrandAssets(): BrandAssets {
    return this.state.brandAssets;
  }
  public updateBrandAssets(updates: Partial<BrandAssets>): BrandAssets {
    this.state.brandAssets = {
      ...this.state.brandAssets,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.brandAssets;
  }

  // Contact Channels
  public getContactChannels(): ContactChannels {
    return this.state.contactChannels;
  }
  public updateContactChannels(updates: Partial<ContactChannels>): ContactChannels {
    this.state.contactChannels = {
      ...this.state.contactChannels,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.contactChannels;
  }

  // Social Links
  public getSocialLinks(onlyVisible = false): SocialLink[] {
    let list = this.state.socialLinks;
    if (onlyVisible) list = list.filter(item => item.visible && item.url);
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }

  // Survey Links
  public getSurveyLinks(): SurveyLink[] {
    return [...this.state.surveyLinks].sort((a, b) => a.sort_order - b.sort_order);
  }
  public updateSurveyLink(id: string, updates: Partial<SurveyLink>): SurveyLink | null {
    const idx = this.state.surveyLinks.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.state.surveyLinks[idx] = { ...this.state.surveyLinks[idx], ...updates };
    this.persist();
    return this.state.surveyLinks[idx];
  }
  public addSurveyLink(link: Omit<SurveyLink, 'id' | 'created_at'>): SurveyLink {
    const newLink: SurveyLink = {
      ...link,
      id: `surv-${Date.now()}`
    };
    this.state.surveyLinks.push(newLink);
    this.persist();
    return newLink;
  }
  public deleteSurveyLink(id: string): boolean {
    const initial = this.state.surveyLinks.length;
    this.state.surveyLinks = this.state.surveyLinks.filter(l => l.id !== id);
    if (this.state.surveyLinks.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  // Women's Corner Sections
  public getWomensCornerSections(onlyPublished = false): WomensCornerSection[] {
    let list = this.state.womensCornerSections;
    if (onlyPublished) list = list.filter(sec => sec.status === 'published');
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }
  public updateWomensCornerSection(id: string, updates: Partial<WomensCornerSection>): WomensCornerSection | null {
    const idx = this.state.womensCornerSections.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.state.womensCornerSections[idx] = { ...this.state.womensCornerSections[idx], ...updates };
    this.persist();
    return this.state.womensCornerSections[idx];
  }

  // Campaign Updates
  public getUpdates(statusFilter?: string, categoryFilter?: string): CampaignUpdate[] {
    let list = this.state.updates;
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(u => u.status === statusFilter);
    }
    if (categoryFilter && categoryFilter !== 'all') {
      list = list.filter(u => u.category === categoryFilter);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  public getUpdateBySlug(slug: string): CampaignUpdate | null {
    return this.state.updates.find(u => u.slug === slug) || null;
  }
  public getUpdateById(id: string): CampaignUpdate | null {
    return this.state.updates.find(u => u.id === id) || null;
  }
  public addUpdate(item: Omit<CampaignUpdate, 'id' | 'created_at' | 'updated_at'>): CampaignUpdate {
    const now = new Date().toISOString();
    const newUpdate: CampaignUpdate = {
      ...item,
      id: `upd-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    this.state.updates.unshift(newUpdate);
    this.persist();
    return newUpdate;
  }
  public updateUpdate(id: string, updates: Partial<CampaignUpdate>): CampaignUpdate | null {
    const idx = this.state.updates.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.state.updates[idx] = {
      ...this.state.updates[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.updates[idx];
  }
  public deleteUpdate(id: string): boolean {
    const initialLen = this.state.updates.length;
    this.state.updates = this.state.updates.filter(u => u.id !== id);
    if (this.state.updates.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Events
  public getEvents(statusFilter?: string): CampaignEvent[] {
    let list = this.state.events;
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(e => e.status === statusFilter);
    }
    return list.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  }
  public addEvent(item: Omit<CampaignEvent, 'id' | 'created_at' | 'updated_at'>): CampaignEvent {
    const now = new Date().toISOString();
    const newEvent: CampaignEvent = {
      ...item,
      id: `evt-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    this.state.events.push(newEvent);
    this.persist();
    return newEvent;
  }
  public updateEvent(id: string, updates: Partial<CampaignEvent>): CampaignEvent | null {
    const idx = this.state.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.state.events[idx] = {
      ...this.state.events[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.events[idx];
  }
  public deleteEvent(id: string): boolean {
    const initial = this.state.events.length;
    this.state.events = this.state.events.filter(e => e.id !== id);
    if (this.state.events.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  // Testimonials
  public getTestimonials(onlyPublished = false): Testimonial[] {
    let list = this.state.testimonials;
    if (onlyPublished) {
      list = list.filter(t => t.status === 'published' && t.consent_confirmed);
    }
    return list;
  }
  public addTestimonial(item: Omit<Testimonial, 'id' | 'created_at'>): Testimonial {
    // Constraint check: cannot publish unless consent confirmed
    if (item.status === 'published' && !item.consent_confirmed) {
      throw new Error('Testimonial publication blocked: consent_confirmed must be true.');
    }
    const newTestimonial: Testimonial = {
      ...item,
      id: `tst-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.state.testimonials.push(newTestimonial);
    this.persist();
    return newTestimonial;
  }
  public updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const idx = this.state.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const current = this.state.testimonials[idx];
    const candidateConsent = updates.consent_confirmed !== undefined ? updates.consent_confirmed : current.consent_confirmed;
    const candidateStatus = updates.status !== undefined ? updates.status : current.status;

    if (candidateStatus === 'published' && !candidateConsent) {
      throw new Error('Testimonial publication blocked: consent_confirmed must be true.');
    }

    this.state.testimonials[idx] = { ...current, ...updates };
    this.persist();
    return this.state.testimonials[idx];
  }
  public deleteTestimonial(id: string): boolean {
    const initial = this.state.testimonials.length;
    this.state.testimonials = this.state.testimonials.filter(t => t.id !== id);
    if (this.state.testimonials.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  // FAQ
  public getFAQItems(onlyPublished = false): FAQItem[] {
    let list = this.state.faqItems;
    if (onlyPublished) list = list.filter(f => f.status === 'published');
    return list.sort((a, b) => a.sort_order - b.sort_order);
  }
  public addFAQItem(item: Omit<FAQItem, 'id' | 'created_at'>): FAQItem {
    const newItem: FAQItem = {
      ...item,
      id: `faq-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.state.faqItems.push(newItem);
    this.persist();
    return newItem;
  }
  public updateFAQItem(id: string, updates: Partial<FAQItem>): FAQItem | null {
    const idx = this.state.faqItems.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.state.faqItems[idx] = { ...this.state.faqItems[idx], ...updates };
    this.persist();
    return this.state.faqItems[idx];
  }
  public deleteFAQItem(id: string): boolean {
    const initial = this.state.faqItems.length;
    this.state.faqItems = this.state.faqItems.filter(f => f.id !== id);
    if (this.state.faqItems.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  // Media Gallery
  public getMediaGallery(): MediaItem[] {
    return [...this.state.mediaGallery].sort((a, b) => a.sort_order - b.sort_order);
  }
  public addMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>): MediaItem {
    if (!item.alt_text || item.alt_text.trim() === '') {
      throw new Error('Accessibility requirement: alt_text is mandatory.');
    }
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.state.mediaGallery.push(newItem);
    this.persist();
    return newItem;
  }
  public deleteMediaItem(id: string): boolean {
    const initial = this.state.mediaGallery.length;
    this.state.mediaGallery = this.state.mediaGallery.filter(m => m.id !== id);
    if (this.state.mediaGallery.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  // Policies (Gated by Teaser Mode)
  public getPolicies(onlyPublished = false): PolicyItem[] {
    // If teaser mode is active, policy details are hidden on the public site
    if (onlyPublished && this.state.siteSettings.agenda_teaser_mode) {
      return [];
    }
    let list = this.state.policyItems;
    if (onlyPublished) list = list.filter(p => p.status === 'published');
    return list;
  }
  public addPolicyItem(item: Omit<PolicyItem, 'id' | 'created_at' | 'updated_at'>): PolicyItem {
    if (this.state.siteSettings.agenda_teaser_mode) {
      throw new Error('Policy Hub is currently locked in Teaser Mode. Toggle off teaser mode to create policy platform items.');
    }
    const now = new Date().toISOString();
    const newItem: PolicyItem = {
      ...item,
      id: `pol-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    this.state.policyItems.push(newItem);
    this.persist();
    return newItem;
  }
  public updatePolicyItem(id: string, updates: Partial<PolicyItem>): PolicyItem | null {
    const idx = this.state.policyItems.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.state.policyItems[idx] = {
      ...this.state.policyItems[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.state.policyItems[idx];
  }
  public deletePolicyItem(id: string): boolean {
    const initial = this.state.policyItems.length;
    this.state.policyItems = this.state.policyItems.filter(p => p.id !== id);
    if (this.state.policyItems.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  // Contact Submissions
  public getContactSubmissions(statusFilter?: string): ContactSubmission[] {
    let list = this.state.contactSubmissions;
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(c => c.status === statusFilter);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  public addContactSubmission(item: Omit<ContactSubmission, 'id' | 'created_at' | 'status'>): ContactSubmission {
    const newSub: ContactSubmission = {
      ...item,
      id: `cnt-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    this.state.contactSubmissions.unshift(newSub);
    this.persist();
    return newSub;
  }
  public updateContactSubmissionStatus(id: string, status: ContactSubmission['status']): ContactSubmission | null {
    const idx = this.state.contactSubmissions.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.state.contactSubmissions[idx].status = status;
    this.persist();
    return this.state.contactSubmissions[idx];
  }

  // Student Voice Submissions
  public getStudentVoiceSubmissions(statusFilter?: string): StudentVoiceSubmission[] {
    let list = this.state.studentVoiceSubmissions;
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(v => v.status === statusFilter);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  public addStudentVoiceSubmission(item: Omit<StudentVoiceSubmission, 'id' | 'created_at' | 'status'>): StudentVoiceSubmission {
    const newVoice: StudentVoiceSubmission = {
      ...item,
      id: `vce-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    this.state.studentVoiceSubmissions.unshift(newVoice);
    this.persist();
    return newVoice;
  }
  public updateStudentVoiceStatus(id: string, status: StudentVoiceSubmission['status']): StudentVoiceSubmission | null {
    const idx = this.state.studentVoiceSubmissions.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.state.studentVoiceSubmissions[idx].status = status;
    this.persist();
    return this.state.studentVoiceSubmissions[idx];
  }

  // Volunteer Registrations
  public getVolunteerRegistrations(typeFilter?: string): VolunteerRegistration[] {
    let list = this.state.volunteerRegistrations;
    if (typeFilter && typeFilter !== 'all') {
      list = list.filter(r => r.registration_type === typeFilter);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  public addVolunteerRegistration(item: Omit<VolunteerRegistration, 'id' | 'created_at'>): VolunteerRegistration {
    const newReg: VolunteerRegistration = {
      ...item,
      id: `vol-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.state.volunteerRegistrations.unshift(newReg);
    this.persist();
    return newReg;
  }

  // Admin Users & Permissions
  public getAdminUsers(): AdminUser[] {
    return this.state.adminUsers;
  }
  public getAdminUserById(id: string): AdminUser | null {
    return this.state.adminUsers.find(u => u.id === id) || null;
  }
  public addAdminUser(user: Omit<AdminUser, 'id' | 'created_at'>): AdminUser {
    const newUser: AdminUser = {
      ...user,
      id: `adm-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.state.adminUsers.push(newUser);
    this.persist();
    return newUser;
  }
  public updateAdminUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
    const idx = this.state.adminUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.state.adminUsers[idx] = { ...this.state.adminUsers[idx], ...updates };
    this.persist();
    return this.state.adminUsers[idx];
  }
  public deleteAdminUser(id: string): boolean {
    if (this.state.adminUsers.length <= 1) {
      throw new Error('Cannot delete the only administrative user account.');
    }
    const initial = this.state.adminUsers.length;
    this.state.adminUsers = this.state.adminUsers.filter(u => u.id !== id);
    if (this.state.adminUsers.length !== initial) {
      this.persist();
      return true;
    }
    return false;
  }

  // Audit Logs (Append-Only)
  public getAuditLogs(): AuditLogEntry[] {
    return [...this.state.auditLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'created_at'>): AuditLogEntry {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.state.auditLogs.unshift(newLog);
    this.persist();
    return newLog;
  }
}

export const db = new CampaignDatabase();
