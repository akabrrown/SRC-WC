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
  AdminUser, 
  AuditLogEntry, 
  ContactSubmission, 
  StudentVoiceSubmission, 
  VolunteerRegistration 
} from '../types/index.js';

export function getInitialSeedData() {
  const candidateProfile: CandidateProfile = {
    id: 'primary',
    full_name: '[Candidate Full Name]',
    display_name: '[Candidate Name]',
    position_title: "SRC Women's Commissioner",
    institution_name: 'University of Professional Studies, Accra (UPSA)',
    programme: 'BSc. Accounting with Finance',
    level: '300',
    slogan: '[Campaign Slogan Goes Here]',
    short_bio: 'A committed advocate for student welfare, gender inclusion, and practical campus resource distribution. Dedicated to bringing responsive leadership and measurable accountability to the Office of the SRC Women\'s Commissioner.',
    hero_photo_url: '',
    about_photo_urls: [],
    favicon_url: '',
    seo_description: "Official campaign website for the SRC Women's Commissioner candidate at UPSA. Discover our vision, campus initiatives, and student voice platform.",
    is_placeholder: true,
    updated_at: new Date().toISOString()
  };

  const siteSettings: SiteSettings = {
    id: 'primary',
    agenda_teaser_mode: true,
    accountability_tracker_visible: false,
    teaser_video_url: '',
    election_date: '2026-10-15',
    ga_id: '',
    meta_pixel_id: '',
    domain: 'upsa-src-wc.org',
    updated_at: new Date().toISOString()
  };

  const visionContent: VisionContent = {
    id: 'primary',
    vision_statement: '[Approved Vision Statement — Draft Pending Approval]',
    mission_statement: 'To foster an equitable, supportive, and career-enabling campus environment for all women students at UPSA through transparent representation, targeted welfare interventions, and direct policy advocacy.',
    is_placeholder: true,
    updated_at: new Date().toISOString()
  };

  const brandAssets: BrandAssets = {
    id: 'primary',
    logo_url: '',
    color_overrides: {
      navy: '#00004E',
      navyDark: '#00002E',
      gold: '#C69500',
      surface: '#FFFFFF',
      muted: '#F4F1EA',
      border: '#E5E5E0',
      ink: '#1A1A1A'
    },
    typography_notes: 'Inter (Headings: Bold/SemiBold; Body: Regular/Medium). Tabular figures for statistics.',
    updated_at: new Date().toISOString()
  };

  const contactChannels: ContactChannels = {
    id: 'primary',
    whatsapp_number: '+233240000000',
    phone_number: '+233240000000',
    email: 'contact@upsa-src-wc.org',
    office_location: 'UPSA Student Centre, Room 204',
    contact_form_recipient_email: 'campaign@upsa-src-wc.org',
    volunteer_recipient_email: 'mobilisation@upsa-src-wc.org',
    updated_at: new Date().toISOString()
  };

  const values: CampaignValue[] = [
    { id: 'val-1', title: 'Service', description: 'Committed to prioritising student needs over ceremonial office privileges.', sort_order: 1 },
    { id: 'val-2', title: 'Integrity', description: 'Transparent reporting of committee allocations, sponsorships, and decisions.', sort_order: 2 },
    { id: 'val-3', title: 'Inclusion', description: 'Ensuring commuter students, hostel residents, and evening streams have equal access.', sort_order: 3 },
    { id: 'val-4', title: 'Courage', description: 'Stepping forward on difficult student issues without institutional compromise.', sort_order: 4 },
    { id: 'val-5', title: 'Accountability', description: 'Regular town halls and verifiable quarterly milestone reporting.', sort_order: 5 },
    { id: 'val-6', title: 'Empathy', description: 'Listening first to lived campus challenges before drafting intervention policies.', sort_order: 6 },
    { id: 'val-7', title: 'Excellence', description: 'Professional execution of programmes and professional development opportunities.', sort_order: 7 }
  ];

  const promises: LeadershipPromise[] = [
    {
      id: 'prom-1',
      promise_number: 1,
      title: 'I Will Listen',
      description: 'Host bi-weekly open-door listening desks across campus hostels and lecture blocks to hear student concerns directly.',
      sort_order: 1
    },
    {
      id: 'prom-2',
      promise_number: 2,
      title: 'I Will Advocate',
      description: 'Take student welfare demands straight to faculty administration with documented evidence and clear solutions.',
      sort_order: 2
    },
    {
      id: 'prom-3',
      promise_number: 3,
      title: 'I Will Account',
      description: 'Publish verified reports on every cedi disbursed, event hosted, and student concern handled.',
      sort_order: 3
    }
  ];

  const socialLinks: SocialLink[] = [
    { id: 'soc-1', platform: 'instagram', url: 'https://instagram.com/upsawomenscomm', visible: true, sort_order: 1 },
    { id: 'soc-2', platform: 'tiktok', url: 'https://tiktok.com/@upsawomenscomm', visible: true, sort_order: 2 },
    { id: 'soc-3', platform: 'x', url: 'https://x.com/upsawomenscomm', visible: true, sort_order: 3 },
    { id: 'soc-4', platform: 'linkedin', url: 'https://linkedin.com/company/upsa-src', visible: true, sort_order: 4 },
    { id: 'soc-5', platform: 'whatsapp', url: 'https://wa.me/233240000000', visible: true, sort_order: 5 }
  ];

  const surveyLinks: SurveyLink[] = [
    {
      id: 'surv-1',
      form_name: "Women's Campus Needs Survey 2026",
      platform: 'Google Forms',
      url: 'https://forms.gle/sample-needs-survey',
      status: 'live',
      description: 'Confidential campus-wide survey capturing sanitation, security, and career preparation priorities.',
      sort_order: 1
    },
    {
      id: 'surv-2',
      form_name: 'Hostel Safety & Commuter Quick Poll',
      platform: 'Typeform',
      url: 'https://poll.typeform.com/to/sample',
      status: 'live',
      description: 'A 2-minute pulse check on evening transit safety and campus lighting around major hostels.',
      sort_order: 2
    },
    {
      id: 'surv-3',
      form_name: 'Mentorship & Industry Apprenticeship Form',
      platform: 'Google Forms',
      url: '',
      status: 'coming_soon',
      description: 'Connecting female students with industry alumnae in finance, law, tech, and marketing.',
      sort_order: 3
    }
  ];

  const womensCornerSections: WomensCornerSection[] = [
    {
      id: 'wc-1',
      title: "Women's Issues",
      icon: 'shield-alert',
      body: 'Tackling systemic campus hurdles: safe shuttle hours, well-maintained sanitation facilities in academic blocks, and clear reporting mechanisms for harassment with guaranteed confidentiality.',
      sort_order: 1,
      status: 'published'
    },
    {
      id: 'wc-2',
      title: 'Opportunities',
      icon: 'briefcase',
      body: 'Direct partnerships with corporate sponsors for paid internships, CV clinics with top recruiters, and structured skills bootcamps in financial modelling and data analytics.',
      sort_order: 2,
      status: 'published'
    },
    {
      id: 'wc-3',
      title: 'Resources',
      icon: 'book-open',
      body: 'Free academic past-question repositories, emergency hygiene kits in hostel warden offices, and peer-to-peer tutoring circles for demanding quantitative courses.',
      sort_order: 3,
      status: 'published'
    },
    {
      id: 'wc-4',
      title: 'Support',
      icon: 'heart-handshake',
      body: 'Mental wellness drop-in sessions with qualified campus counsellors, anonymous welfare support requests, and legal clinic partnerships for student rights protection.',
      sort_order: 4,
      status: 'published'
    }
  ];

  const updates: CampaignUpdate[] = [
    {
      id: 'upd-1',
      title: 'Campus Engagement: Listening Tour Begins Across Hostels',
      slug: 'campus-engagement-listening-tour-begins',
      category: 'engagement',
      excerpt: 'Meeting students across campus hostels to document priority welfare and security challenges.',
      body: 'Our campaign team officially launched the campus listening tour this week, visiting five major student hostels around the UPSA campus perimeter. Students shared candid insights on security lighting, water pressure consistency, and study space availability during examination periods. Every point documented will directly shape our policy platform.',
      cover_image_url: '',
      status: 'published',
      published_at: '2026-09-01T10:00:00Z',
      created_at: '2026-09-01T09:00:00Z',
      updated_at: '2026-09-01T10:00:00Z'
    },
    {
      id: 'upd-2',
      title: 'Student Voice Survey Passes 800 Verified Responses',
      slug: 'student-voice-survey-passes-800-responses',
      category: 'milestone',
      excerpt: 'Over 800 female students have shared their campus priorities in our ongoing baseline study.',
      body: 'We are proud to announce that the Women\'s Campus Needs Survey has received over 800 detailed responses from both regular and evening stream students. Early data highlights career development workshops and campus transit safety as top student concerns.',
      cover_image_url: '',
      status: 'published',
      published_at: '2026-09-04T14:30:00Z',
      created_at: '2026-09-04T12:00:00Z',
      updated_at: '2026-09-04T14:30:00Z'
    },
    {
      id: 'upd-3',
      title: 'Speech: Why Representation Must Be Measurable and Accountable',
      slug: 'speech-why-representation-must-be-measurable',
      category: 'speech',
      excerpt: 'Remarks delivered at the Faculty of Information Technology and Communication Studies town hall.',
      body: 'Student representation is not a ceremonial ribbon-cutting post. It is an administrative office with an obligation to deliver real, verifiable improvements to everyday campus life. In this speech, we outline our commitment to publishing audited milestone reports.',
      cover_image_url: '',
      status: 'published',
      published_at: '2026-09-06T16:00:00Z',
      created_at: '2026-09-06T15:00:00Z',
      updated_at: '2026-09-06T16:00:00Z'
    }
  ];

  const events: CampaignEvent[] = [
    {
      id: 'evt-1',
      name: 'Campus Town Hall: Women in Leadership & Student Welfare',
      event_date: '2026-09-20',
      event_time: '4:00 PM - 6:00 PM',
      venue: 'LBC Auditorium, UPSA Campus',
      description: 'An open forum discussing student welfare priorities, hostel security solutions, and academic balance with guest alumnae speakers.',
      registration_link: 'https://forms.gle/townhall-reg',
      status: 'published',
      created_at: '2026-09-02T10:00:00Z',
      updated_at: '2026-09-02T10:00:00Z'
    },
    {
      id: 'evt-2',
      name: 'CV Clinic & LinkedIn Optimization Workshop',
      event_date: '2026-09-28',
      event_time: '2:00 PM - 5:00 PM',
      venue: 'Virtual / Zoom & Student Centre Lab 3',
      description: 'Hands-on review with corporate HR partners to prepare penultimate and final year students for national service and graduate roles.',
      registration_link: 'https://forms.gle/cvclinic-reg',
      status: 'published',
      created_at: '2026-09-03T11:00:00Z',
      updated_at: '2026-09-03T11:00:00Z'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 'tst-1',
      name: 'Akosua Mensah',
      programme_role: 'BSc. Banking & Finance, Level 400',
      statement: 'She has consistently championed student issues on our course committees without waiting for campaign season. That consistency is what UPSA women need.',
      photo_url: '',
      consent_confirmed: true,
      status: 'published',
      created_at: '2026-09-03T09:00:00Z'
    },
    {
      id: 'tst-2',
      name: 'Deborah Tetteh',
      programme_role: 'BA Public Relations, Level 300',
      statement: 'Her focus on data-driven policy rather than vague promises stands out. She listened to our hostel transit concerns and brought practical solutions.',
      photo_url: '',
      consent_confirmed: true,
      status: 'published',
      created_at: '2026-09-04T10:00:00Z'
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'About the Candidate',
      question: 'What is the candidate\'s academic background and student involvement?',
      answer: 'The candidate is an honours student in the Faculty of Accounting and Finance with three years of active leadership across faculty associations, student committees, and volunteer campus outreach.',
      sort_order: 1,
      status: 'published',
      created_at: '2026-09-01T08:00:00Z'
    },
    {
      id: 'faq-2',
      category: 'Why She Is Contesting',
      question: 'What motivated her to contest for SRC Women\'s Commissioner?',
      answer: 'To transform the office from purely ceremonial activities into a proactive welfare, security, and career advocacy institution that serves both morning, afternoon, and evening stream students.',
      sort_order: 2,
      status: 'published',
      created_at: '2026-09-01T08:00:00Z'
    },
    {
      id: 'faq-3',
      category: 'Role of the SRC Women\'s Commissioner',
      question: 'What are the formal constitutional responsibilities of this office?',
      answer: 'Under the UPSA SRC Constitution, the Women\'s Commissioner advocates for the specific welfare, security, and academic interests of female students, chairs the Women\'s Commission, and coordinates targeted developmental programmes.',
      sort_order: 3,
      status: 'published',
      created_at: '2026-09-01T08:00:00Z'
    },
    {
      id: 'faq-4',
      category: 'Campaign Agenda',
      question: 'When will the full policy agenda be officially unveiled?',
      answer: 'The policy platform is currently in Teaser Mode while we incorporate final findings from our campus-wide survey. It will be officially launched at the upcoming campus town hall.',
      sort_order: 4,
      status: 'published',
      created_at: '2026-09-01T08:00:00Z'
    },
    {
      id: 'faq-5',
      category: 'How Policies Will Be Implemented',
      question: 'How will planned initiatives be funded and sustained?',
      answer: 'Through statutory SRC committee budget allocations combined with transparent corporate sponsorships and alumni network partnerships, with every expenditure publicly disclosed.',
      sort_order: 5,
      status: 'published',
      created_at: '2026-09-01T08:00:00Z'
    },
    {
      id: 'faq-6',
      category: 'How Students Can Participate',
      question: 'How can students join the campaign or contribute ideas?',
      answer: 'You can submit suggestions through the Student Voice section or register as an ambassador or campaign team member via the "Join the Movement" page.',
      sort_order: 6,
      status: 'published',
      created_at: '2026-09-01T08:00:00Z'
    },
    {
      id: 'faq-7',
      category: 'How to Contact the Candidate',
      question: 'What is the fastest way to reach the campaign team?',
      answer: 'Via our verified campaign WhatsApp channel, by direct phone call, or using the contact form on this website. Our team responds within 24 hours.',
      sort_order: 7,
      status: 'published',
      created_at: '2026-09-01T08:00:00Z'
    }
  ];

  const adminUsers: AdminUser[] = [
    {
      id: 'adm-1',
      name: 'Aka (Lead Admin)',
      email: 'admin@upsa-src-wc.org',
      role_label: 'Campaign Manager & ICT Lead',
      permission_scope: [
        'manage_settings',
        'manage_identity',
        'manage_policy',
        'manage_updates',
        'manage_media',
        'manage_events',
        'manage_voice',
        'manage_volunteers',
        'manage_users',
        'publish'
      ],
      created_at: new Date().toISOString()
    }
  ];

  const auditLogs: AuditLogEntry[] = [
    {
      id: 'aud-1',
      admin_user_id: 'adm-1',
      admin_name: 'Aka (Lead Admin)',
      action: 'INITIALIZE_SYSTEM',
      entity: 'System',
      entity_id: 'primary',
      details: 'Initialized campaign platform with launch-phase teaser configuration.',
      created_at: new Date().toISOString()
    }
  ];

  const policyItems: PolicyItem[] = [
    {
      id: 'pol-1',
      title: 'Hostel Transit & Perimeter Safety Initiative',
      summary: 'Securing extended campus shuttle operations and dedicated security lighting around off-campus hostels.',
      issue_statement: 'Over 65% of female students residing in off-campus hostels report anxiety walking back from late-evening library sessions due to unlit paths.',
      solution: 'Establish a designated evening shuttle schedule between the campus gate and major hostels, in coordination with the campus marshal and local security.',
      why_it_matters: 'Physical safety is a fundamental prerequisite for academic success and peace of mind.',
      implementation_plan: 'Partner with registered campus commercial transport unions and university estate management.',
      timeline: 'First 60 days of taking office',
      partners: 'UPSA Estate Department, Campus Marshals, Hostel Management Union',
      cost_notes: 'Supported by existing welfare subvention with transport partner subsidies.',
      beneficiaries: 'Commuter and hostel students, particularly evening stream learners.',
      success_indicators: 'Zero reported transit security incidents and verified evening ridership logs.',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const contactSubmissions: ContactSubmission[] = [];
  const studentVoiceSubmissions: StudentVoiceSubmission[] = [];
  const volunteerRegistrations: VolunteerRegistration[] = [];
  const mediaGallery: MediaItem[] = [];

  return {
    candidateProfile,
    siteSettings,
    visionContent,
    brandAssets,
    contactChannels,
    values,
    promises,
    socialLinks,
    surveyLinks,
    womensCornerSections,
    updates,
    events,
    testimonials,
    faqItems,
    mediaGallery,
    policyItems,
    contactSubmissions,
    studentVoiceSubmissions,
    volunteerRegistrations,
    adminUsers,
    auditLogs
  };
}
