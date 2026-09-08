-- ============================================================================
-- SRC WOMEN'S COMMISSIONER CAMPAIGN - DATABASE SCHEMA (PostgreSQL / Supabase)
-- Document Version: 1.0 | Standard: Technical & CMS Specification §5
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Identity & Settings (Singleton Rows)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS candidate_profile (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    full_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    position_title TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    programme TEXT NOT NULL,
    level TEXT NOT NULL,
    slogan TEXT NOT NULL,
    short_bio TEXT NOT NULL,
    hero_photo_url TEXT,
    about_photo_urls JSONB DEFAULT '[]'::jsonb,
    favicon_url TEXT,
    seo_description TEXT,
    is_placeholder BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    agenda_teaser_mode BOOLEAN NOT NULL DEFAULT true,
    accountability_tracker_visible BOOLEAN NOT NULL DEFAULT false,
    teaser_video_url TEXT,
    election_date DATE,
    ga_id TEXT,
    meta_pixel_id TEXT,
    domain TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vision_content (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    vision_statement TEXT NOT NULL,
    mission_statement TEXT NOT NULL,
    is_placeholder BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brand_assets (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    logo_url TEXT,
    color_overrides JSONB DEFAULT '{}'::jsonb,
    typography_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_channels (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    whatsapp_number TEXT,
    phone_number TEXT,
    email TEXT,
    office_location TEXT,
    contact_form_recipient_email TEXT,
    volunteer_recipient_email TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5.2 Structured Lists
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS campaign_values (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leadership_promises (
    id TEXT PRIMARY KEY,
    promise_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_links (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS survey_links (
    id TEXT PRIMARY KEY,
    form_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('live', 'coming_soon')),
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS womens_corner_sections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5.3 Dynamic Content (Workflow-Managed)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS campaign_updates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('news', 'engagement', 'policy_update', 'speech', 'media_feature', 'milestone')),
    excerpt TEXT,
    body TEXT NOT NULL,
    cover_image_url TEXT,
    author_id TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    registration_link TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    programme_role TEXT NOT NULL,
    statement TEXT NOT NULL,
    photo_url TEXT,
    video_url TEXT,
    consent_confirmed BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Constraint: Cannot publish testimonial unless consent_confirmed is TRUE
ALTER TABLE testimonials ADD CONSTRAINT chk_testimonial_consent_published 
    CHECK (status <> 'published' OR consent_confirmed = true);

CREATE TABLE IF NOT EXISTS faq_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN (
        'About the Candidate',
        'Why She Is Contesting',
        'Role of the SRC Women''s Commissioner',
        'Campaign Agenda',
        'How Policies Will Be Implemented',
        'How Students Can Participate',
        'How to Contact the Candidate'
    )),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_gallery (
    id TEXT PRIMARY KEY,
    media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
    url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT NOT NULL,
    event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policy_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    issue_statement TEXT NOT NULL,
    solution TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    implementation_plan TEXT,
    timeline TEXT,
    partners TEXT,
    cost_notes TEXT,
    beneficiaries TEXT,
    success_indicators TEXT,
    video_url TEXT,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5.4 Public Submissions (Write-Only for Anon Role)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    programme TEXT NOT NULL,
    contact TEXT NOT NULL,
    enquiry_category TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_voice_submissions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('concern', 'idea')),
    name TEXT,
    programme TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteer_registrations (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    programme TEXT NOT NULL,
    level TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    area_of_interest TEXT NOT NULL,
    skills TEXT,
    availability TEXT NOT NULL,
    motivation TEXT,
    registration_type TEXT NOT NULL CHECK (registration_type IN ('volunteer', 'campaign_team', 'ambassador', 'supporter')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5.5 Admin & Governance
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role_label TEXT NOT NULL,
    permission_scope TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    admin_user_id TEXT NOT NULL,
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE candidate_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_promises ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE womens_corner_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_voice_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published/live records
CREATE POLICY "Public can view published candidate_profile" ON candidate_profile FOR SELECT USING (true);
CREATE POLICY "Public can view site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view vision_content" ON vision_content FOR SELECT USING (true);
CREATE POLICY "Public can view brand_assets" ON brand_assets FOR SELECT USING (true);
CREATE POLICY "Public can view contact_channels" ON contact_channels FOR SELECT USING (true);
CREATE POLICY "Public can view campaign_values" ON campaign_values FOR SELECT USING (true);
CREATE POLICY "Public can view leadership_promises" ON leadership_promises FOR SELECT USING (true);
CREATE POLICY "Public can view visible social_links" ON social_links FOR SELECT USING (visible = true);
CREATE POLICY "Public can view survey_links" ON survey_links FOR SELECT USING (true);
CREATE POLICY "Public can view published womens_corner" ON womens_corner_sections FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published updates" ON campaign_updates FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (status = 'published' AND consent_confirmed = true);
CREATE POLICY "Public can view published faq" ON faq_items FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view media_gallery" ON media_gallery FOR SELECT USING (true);
CREATE POLICY "Public can view published policies" ON policy_items FOR SELECT USING (status = 'published');

-- Public INSERT-only on submissions
CREATE POLICY "Public insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert student_voice_submissions" ON student_voice_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert volunteer_registrations" ON volunteer_registrations FOR INSERT WITH CHECK (true);

-- Authenticated Admin full access
CREATE POLICY "Admin full access candidate_profile" ON candidate_profile FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access vision_content" ON vision_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access brand_assets" ON brand_assets FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access contact_channels" ON contact_channels FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access campaign_values" ON campaign_values FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access leadership_promises" ON leadership_promises FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access social_links" ON social_links FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access survey_links" ON survey_links FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access womens_corner" ON womens_corner_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access campaign_updates" ON campaign_updates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access events" ON events FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access faq_items" ON faq_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access media_gallery" ON media_gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access policy_items" ON policy_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access contact_submissions" ON contact_submissions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access student_voice_submissions" ON student_voice_submissions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access volunteer_registrations" ON volunteer_registrations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access admin_users" ON admin_users FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin read and insert audit_log" ON audit_log FOR SELECT TO authenticated USING (true);
