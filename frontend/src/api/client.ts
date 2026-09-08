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

const API_BASE = '/api';

class ApiClient {
  private currentAdminId: string = 'adm-1';

  public setAdminId(id: string) {
    this.currentAdminId = id;
  }

  public getAdminId(): string {
    return this.currentAdminId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('x-admin-id', this.currentAdminId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        signal: options.signal || controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail = 'API request failed';
        try {
          const rawText = await response.text();
          try {
            const errorJson = JSON.parse(rawText);
            errorDetail = errorJson.detail || errorJson.title || rawText || errorDetail;
          } catch {
            errorDetail = rawText || errorDetail;
          }
        } catch {
          // fallback to default errorDetail
        }
        throw new Error(errorDetail);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out. Please check your network connection and try again.');
      }
      throw err;
    }
  }

  // --- Public Read APIs ---
  async getCandidateProfile(): Promise<CandidateProfile> {
    return this.request<CandidateProfile>('/identity/candidate');
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/settings');
  }

  async getVision(): Promise<VisionContent> {
    return this.request<VisionContent>('/identity/vision');
  }

  async getValues(): Promise<CampaignValue[]> {
    return this.request<CampaignValue[]>('/identity/values');
  }

  async getPromises(): Promise<LeadershipPromise[]> {
    return this.request<LeadershipPromise[]>('/identity/promises');
  }

  async getSocialLinks(): Promise<SocialLink[]> {
    return this.request<SocialLink[]>('/identity/social-links');
  }

  async getContactChannels(): Promise<ContactChannels> {
    return this.request<ContactChannels>('/identity/contact-channels');
  }

  async getBrandAssets(): Promise<BrandAssets> {
    return this.request<BrandAssets>('/identity/brand-assets');
  }

  async getWomensCornerSections(): Promise<WomensCornerSection[]> {
    return this.request<WomensCornerSection[]>('/womens-corner');
  }

  async getUpdates(category?: string): Promise<CampaignUpdate[]> {
    const query = category && category !== 'All' ? `?category=${category.toLowerCase().replace(' ', '_')}` : '';
    return this.request<CampaignUpdate[]>(`/updates${query}`);
  }

  async getUpdateById(id: string): Promise<CampaignUpdate> {
    return this.request<CampaignUpdate>(`/updates/${id}`);
  }

  async getEvents(): Promise<CampaignEvent[]> {
    return this.request<CampaignEvent[]>('/events');
  }

  async getSurveyLinks(): Promise<SurveyLink[]> {
    return this.request<SurveyLink[]>('/voice/surveys');
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return this.request<Testimonial[]>('/testimonials');
  }

  async getFAQ(): Promise<FAQItem[]> {
    return this.request<FAQItem[]>('/faq');
  }

  async getMedia(): Promise<MediaItem[]> {
    return this.request<MediaItem[]>('/media');
  }

  async getPolicies(): Promise<PolicyItem[]> {
    return this.request<PolicyItem[]>('/policies');
  }

  // --- Public Form Submissions ---
  async submitContact(contactPayload: { name: string; programme: string; contact: string; enquiry_category: string; message: string }) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactPayload)
    });
  }

  async submitStudentVoice(voicePayload: { type: 'concern' | 'idea'; name?: string; programme?: string; message: string }) {
    return this.request('/voice/submissions', {
      method: 'POST',
      body: JSON.stringify(voicePayload)
    });
  }

  async submitVolunteer(volunteerPayload: {
    full_name: string;
    programme: string;
    level: string;
    phone: string;
    email: string;
    area_of_interest: string;
    skills?: string;
    availability: string;
    motivation?: string;
    registration_type: string;
  }) {
    return this.request('/volunteers', {
      method: 'POST',
      body: JSON.stringify(volunteerPayload)
    });
  }

  // --- Admin CMS Management APIs ---
  async updateCandidateProfile(profilePayload: Partial<CandidateProfile>): Promise<CandidateProfile> {
    return this.request<CandidateProfile>('/identity/candidate', {
      method: 'PUT',
      body: JSON.stringify(profilePayload)
    });
  }

  async updateSiteSettings(settingsPayload: Partial<SiteSettings>): Promise<SiteSettings> {
    return this.request<SiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsPayload)
    });
  }

  async updateVision(visionPayload: Partial<VisionContent>): Promise<VisionContent> {
    return this.request<VisionContent>('/identity/vision', {
      method: 'PUT',
      body: JSON.stringify(visionPayload)
    });
  }

  async updateBrandAssets(brandPayload: Partial<BrandAssets>): Promise<BrandAssets> {
    return this.request<BrandAssets>('/identity/brand-assets', {
      method: 'PUT',
      body: JSON.stringify(brandPayload)
    });
  }

  // Updates Admin
  async getAllUpdatesAdmin(): Promise<CampaignUpdate[]> {
    return this.request<CampaignUpdate[]>('/updates/admin/all');
  }

  async createUpdate(updatePayload: Partial<CampaignUpdate>): Promise<CampaignUpdate> {
    return this.request<CampaignUpdate>('/updates', {
      method: 'POST',
      body: JSON.stringify(updatePayload)
    });
  }

  async updateUpdate(id: string, updatePayload: Partial<CampaignUpdate>): Promise<CampaignUpdate> {
    return this.request<CampaignUpdate>(`/updates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatePayload)
    });
  }

  async deleteUpdate(id: string): Promise<void> {
    return this.request(`/updates/${id}`, { method: 'DELETE' });
  }

  // Events Admin
  async getAllEventsAdmin(): Promise<CampaignEvent[]> {
    return this.request<CampaignEvent[]>('/events/admin/all');
  }

  async createEvent(eventPayload: Partial<CampaignEvent>): Promise<CampaignEvent> {
    return this.request<CampaignEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(eventPayload)
    });
  }

  async updateEvent(id: string, eventPayload: Partial<CampaignEvent>): Promise<CampaignEvent> {
    return this.request<CampaignEvent>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventPayload)
    });
  }

  async deleteEvent(id: string): Promise<void> {
    return this.request(`/events/${id}`, { method: 'DELETE' });
  }

  // Student Voice Admin
  async getStudentVoiceSubmissions(): Promise<StudentVoiceSubmission[]> {
    return this.request<StudentVoiceSubmission[]>('/voice/admin/submissions');
  }

  async updateStudentVoiceStatus(id: string, status: string) {
    return this.request(`/voice/admin/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async createSurveyLink(surveyPayload: Partial<SurveyLink>): Promise<SurveyLink> {
    return this.request<SurveyLink>('/voice/surveys', {
      method: 'POST',
      body: JSON.stringify(surveyPayload)
    });
  }

  async updateSurveyLink(id: string, surveyPayload: Partial<SurveyLink>): Promise<SurveyLink> {
    return this.request<SurveyLink>(`/voice/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(surveyPayload)
    });
  }

  // Volunteers Admin
  async getVolunteers(): Promise<VolunteerRegistration[]> {
    return this.request<VolunteerRegistration[]>('/volunteers');
  }

  // Testimonials Admin
  async getAllTestimonialsAdmin(): Promise<Testimonial[]> {
    return this.request<Testimonial[]>('/testimonials/admin/all');
  }

  async createTestimonial(testimonialPayload: Partial<Testimonial>): Promise<Testimonial> {
    return this.request<Testimonial>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialPayload)
    });
  }

  async updateTestimonial(id: string, testimonialPayload: Partial<Testimonial>): Promise<Testimonial> {
    return this.request<Testimonial>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialPayload)
    });
  }

  async deleteTestimonial(id: string): Promise<void> {
    return this.request(`/testimonials/${id}`, { method: 'DELETE' });
  }

  // FAQ Admin
  async getAllFAQAdmin(): Promise<FAQItem[]> {
    return this.request<FAQItem[]>('/faq/admin/all');
  }

  async createFAQ(faqPayload: Partial<FAQItem>): Promise<FAQItem> {
    return this.request<FAQItem>('/faq', {
      method: 'POST',
      body: JSON.stringify(faqPayload)
    });
  }

  async updateFAQ(id: string, faqPayload: Partial<FAQItem>): Promise<FAQItem> {
    return this.request<FAQItem>(`/faq/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faqPayload)
    });
  }

  async deleteFAQ(id: string): Promise<void> {
    return this.request(`/faq/${id}`, { method: 'DELETE' });
  }

  // Media Admin
  async createMedia(mediaPayload: Partial<MediaItem>): Promise<MediaItem> {
    return this.request<MediaItem>('/media', {
      method: 'POST',
      body: JSON.stringify(mediaPayload)
    });
  }

  async deleteMedia(id: string): Promise<void> {
    return this.request(`/media/${id}`, { method: 'DELETE' });
  }

  // Contact Admin
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return this.request<ContactSubmission[]>('/contact');
  }

  async updateContactStatus(id: string, status: string) {
    return this.request(`/contact/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Policies Admin
  async getAllPoliciesAdmin(): Promise<PolicyItem[]> {
    return this.request<PolicyItem[]>('/policies/admin/all');
  }

  async createPolicy(policyPayload: Partial<PolicyItem>): Promise<PolicyItem> {
    return this.request<PolicyItem>('/policies', {
      method: 'POST',
      body: JSON.stringify(policyPayload)
    });
  }

  async updatePolicy(id: string, policyPayload: Partial<PolicyItem>): Promise<PolicyItem> {
    return this.request<PolicyItem>(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(policyPayload)
    });
  }

  // Admin Users & Audit Logs
  async getAdminUsers(): Promise<AdminUser[]> {
    return this.request<AdminUser[]>('/admin/users');
  }

  async createAdminUser(userPayload: Partial<AdminUser>): Promise<AdminUser> {
    return this.request<AdminUser>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userPayload)
    });
  }

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return this.request<AuditLogEntry[]>('/admin/audit-logs');
  }
}

export const api = new ApiClient();
