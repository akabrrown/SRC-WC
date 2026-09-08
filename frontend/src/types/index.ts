// Domain types for SRC Women's Commissioner Campaign Frontend & CMS

export type ContentStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
export type SubmissionStatus = 'new' | 'read' | 'responded' | 'archived';

export type UpdateCategory = 
  | 'news' 
  | 'engagement' 
  | 'policy_update' 
  | 'speech' 
  | 'media_feature' 
  | 'milestone';

export type FAQCategory = 
  | 'About the Candidate'
  | 'Why She Is Contesting'
  | "Role of the SRC Women's Commissioner"
  | 'Campaign Agenda'
  | 'How Policies Will Be Implemented'
  | 'How Students Can Participate'
  | 'How to Contact the Candidate';

export type RegistrationType = 'volunteer' | 'campaign_team' | 'ambassador' | 'supporter';

export type PermissionScope = 
  | 'manage_settings'
  | 'manage_identity'
  | 'manage_policy'
  | 'manage_updates'
  | 'manage_media'
  | 'manage_events'
  | 'manage_voice'
  | 'manage_volunteers'
  | 'manage_users'
  | 'publish';

export interface CandidateProfile {
  id: string;
  full_name: string;
  display_name: string;
  position_title: string;
  institution_name: string;
  programme: string;
  level: string;
  slogan: string;
  short_bio: string;
  hero_photo_url?: string;
  about_photo_urls: string[];
  favicon_url?: string;
  seo_description?: string;
  is_placeholder: boolean;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  agenda_teaser_mode: boolean;
  accountability_tracker_visible: boolean;
  teaser_video_url?: string;
  election_date?: string;
  ga_id?: string;
  meta_pixel_id?: string;
  domain?: string;
  updated_at: string;
}

export interface VisionContent {
  id: string;
  vision_statement: string;
  mission_statement: string;
  is_placeholder: boolean;
  updated_at: string;
}

export interface BrandAssets {
  id: string;
  logo_url?: string;
  color_overrides: Record<string, string>;
  typography_notes?: string;
  updated_at: string;
}

export interface ContactChannels {
  id: string;
  whatsapp_number?: string;
  phone_number?: string;
  email?: string;
  office_location?: string;
  contact_form_recipient_email?: string;
  volunteer_recipient_email?: string;
  updated_at: string;
}

export interface CampaignValue {
  id: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface LeadershipPromise {
  id: string;
  promise_number: number;
  title: string;
  description: string;
  sort_order: number;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'x' | 'linkedin' | 'whatsapp' | 'youtube';
  url: string;
  visible: boolean;
  sort_order: number;
}

export interface SurveyLink {
  id: string;
  form_name: string;
  platform: string;
  url: string;
  status: 'live' | 'coming_soon';
  description?: string;
  sort_order: number;
}

export interface WomensCornerSection {
  id: string;
  title: string;
  body: string;
  icon: string;
  sort_order: number;
  status: ContentStatus;
}

export interface CampaignUpdate {
  id: string;
  title: string;
  slug: string;
  category: UpdateCategory;
  excerpt: string;
  body: string;
  cover_image_url?: string;
  author_id?: string;
  status: ContentStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignEvent {
  id: string;
  name: string;
  event_date: string;
  event_time: string;
  venue: string;
  description: string;
  registration_link?: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  programme_role: string;
  statement: string;
  photo_url?: string;
  video_url?: string;
  consent_confirmed: boolean;
  status: ContentStatus;
  created_at: string;
}

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  sort_order: number;
  status: ContentStatus;
  created_at: string;
}

export interface MediaItem {
  id: string;
  media_type: 'photo' | 'video';
  url: string;
  caption?: string;
  alt_text: string;
  event_id?: string;
  sort_order: number;
  created_at: string;
}

export interface PolicyItem {
  id: string;
  title: string;
  summary: string;
  issue_statement: string;
  solution: string;
  why_it_matters: string;
  implementation_plan?: string;
  timeline?: string;
  partners?: string;
  cost_notes?: string;
  beneficiaries?: string;
  success_indicators?: string;
  video_url?: string;
  document_url?: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  programme: string;
  contact: string;
  enquiry_category: string;
  message: string;
  status: SubmissionStatus;
  created_at: string;
}

export interface StudentVoiceSubmission {
  id: string;
  type: 'concern' | 'idea';
  name?: string;
  programme?: string;
  message: string;
  status: SubmissionStatus;
  created_at: string;
}

export interface VolunteerRegistration {
  id: string;
  full_name: string;
  programme: string;
  level: string;
  phone: string;
  email: string;
  area_of_interest: string;
  skills?: string;
  availability: string;
  motivation?: string;
  registration_type: RegistrationType;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role_label: string;
  permission_scope: PermissionScope[];
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  admin_user_id: string;
  admin_name: string;
  action: string;
  entity: string;
  entity_id: string;
  details?: string;
  created_at: string;
}
