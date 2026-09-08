<table><tbody><tr><td><strong>SRC WOMEN'S COMMISSIONER CAMPAIGN</strong><br><strong>Figma Prompt Library</strong><br><strong>Public Website + Admin CMS — All Pages &amp; Features</strong><br><em>Brand Palette: UPSA Navy &amp; Gold | Ready-to-Paste AI Design Prompts</em><br>Document Version: 1.0<br>Companion to: Technical &amp; CMS Specification v1.0</td></tr></tbody></table>

**Table of Contents**
=====================

**0\. How to Use This Library**
===============================

Each entry below is a ready-to-paste prompt for Figma's AI design tools (First Draft / Make) or an equivalent AI UI generator (v0, Lovable, etc.). Paste the Master Design System Prompt first in a new file to establish the visual language, then paste each page/screen prompt one at a time — regenerating against the same file keeps them visually consistent.

*   Always generate mobile-first (375px) — the site's primary audience is students on phones. Desktop notes are called out per page where the layout meaningfully changes.
*   Placeholder fields (candidate name, photos, links) are written into the prompts exactly as they should appear on screen — don't replace them with invented content; the real values come from the client checklist.
*   After generating, compare against the anti-generic checklist in §4 before accepting a screen.

**1\. Master Design System Prompt**
===================================

Run this first in any new Figma AI / First Draft session, or as the system-level instruction in v0/Lovable, to lock in the UPSA-based visual language before generating individual pages.

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Design system for a university Student Representative Council (SRC) Women's Commissioner campaign website. Brand colors: primary deep navy #00004E (institutional UPSA navy — headers, nav bar, footer, primary text on light backgrounds), accent gold #C69500 (used sparingly — CTAs, active states, small badges/tags only, never large fills), white #FFFFFF backgrounds, warm off-white #F4F1EA for alternating section backgrounds, neutral border grey #E5E5E0 for dividers and card outlines, near-black #1A1A1A for body text. Typography: Inter — Bold/SemiBold for headings (110-120% line height, tight letter-spacing on large headings), Regular/Medium for body (150% line height). Corner radius 8-16px on cards and buttons, never fully pill-shaped except small category badges. Shadows soft and subtle (6-8% opacity, not the default heavy drop-shadow). Tone: editorial, credible, warm but serious — like a well-run university leadership campaign, not a SaaS product landing page or a Canva template. Mobile-first, 375px base frame, generous touch targets (min 44px). Avoid: glassmorphism, gradient blobs, uniform pill buttons on every element, scroll-fade-in on every section, cursor-following gradient beams, grain-over-gradient textures, italic serif decorative accents, and the Space Grotesk + Instrument Serif pairing.</td></tr></tbody></table>

**2\. Public Website — Page Prompts**
=====================================

**2.1. Home**
-------------

_First impression and hub — orients a student in 5 seconds and routes them to the three things they came for: who she is, what she stands for, how to get involved._

### **Layout, top to bottom**

*   Nav bar: wordmark/candidate name (left), hamburger menu (right) on mobile; full horizontal nav on desktop
*   Hero: full-bleed candidate photo placeholder, campaign slogan as large H1, one-line position/institution subtitle, single primary gold CTA button ("Join the Movement")
*   Values strip: 3-5 short value chips in a horizontal scroll row (mobile) / row (desktop)
*   Latest Campaign Updates: 3 cards in a vertical stack (mobile) / 3-column grid (desktop), each with cover image, category badge, title, one-line excerpt
*   Student Voice callout: a distinct navy card inviting students to a survey or to submit a concern/idea, with two secondary buttons
*   Footer: contact channels, social icons, copyright, link back to institution

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>Hero photo renders as a solid navy rectangle with centered label "[ CANDIDATE PHOTO PENDING ]"; slogan text reads "[Campaign Slogan Goes Here]".</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Home page for the campaign site described in the design system above. Mobile-first, 375px. Sticky navy nav bar with candidate name placeholder and a hamburger icon. Hero section: navy-dark background, a large rounded placeholder image block labeled '[ CANDIDATE PHOTO PENDING ]', bold white headline '[Campaign Slogan Goes Here]', a lighter subtitle 'SRC Women's Commissioner Candidate — [Institution Name]', and one gold primary button 'Join the Movement'. Below: a horizontally scrollable row of 4 small value chips (e.g. Service, Integrity, Inclusion, Accountability) in warm off-white pill badges with navy text. Then a 'Campaign Updates' section header and 3 stacked white cards, each with a navy placeholder cover image, a small gold category badge, a bold title, and a one-line grey excerpt. Then a full-width navy callout card titled 'Your Voice Shapes This Campaign' with two white/outline buttons ('Take the Survey', 'Submit a Concern'). Footer in navy-dark: contact icons row (WhatsApp, email, phone), social icon row, small copyright line.</td></tr></tbody></table>

**2.2. Meet the Candidate**
---------------------------

_Builds personal credibility — the human story behind the campaign._

### **Layout, top to bottom**

*   Page header with breadcrumb/back nav
*   Large portrait photo + name, programme, level, position as a header block
*   "My Story" — 1-2 paragraph bio in a readable single column (max ~65 characters per line)
*   Secondary photo gallery strip (1-3 candid images)
*   Optional pull-quote styled callout with a short personal statement

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>Photo and bio render as clearly labelled placeholders — no invented biographical details.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Meet the Candidate page, mobile-first 375px, matching the campaign design system. Header block: circular or rounded-square photo placeholder labelled '[ CANDIDATE PHOTO PENDING ]', name placeholder '[Candidate Full Name]' in bold navy H2, then grey subtitle '[Programme] · Level [X] · SRC Women's Commissioner Candidate'. Below, a 'My Story' section with a short intro label in gold caption text, then 2 paragraphs of placeholder body copy in Inter Regular at comfortable line height. A horizontally scrollable strip of 2-3 smaller rounded photo placeholders labelled 'campaign photo pending'. Finish with a navy pull-quote card containing a large opening-quote mark in gold and placeholder italic text '[Personal statement pending]'.</td></tr></tbody></table>

**2.3. My Vision**
------------------

_States the campaign's guiding philosophy before any specific policy — the 'why' behind the 'what'._

### **Layout, top to bottom**

*   Vision statement — large, editorial pull-quote style treatment
*   Mission statement — supporting paragraph directly below
*   My Values — grid/list of value cards, each with a short title + one-line description
*   Leadership Promise — 3 numbered commitment cards (Listen / Advocate / Account)

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>Vision and mission render as placeholder text blocks flagged "Draft pending approval"; values default to the blueprint's suggested seven so the page never looks empty.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>My Vision page, mobile-first 375px, campaign design system. Top section: large centered navy H1 styled as a statement/pull-quote reading '[Approved Vision Statement — Draft Pending Approval]', with a thin gold rule above it. Below, a body paragraph for the mission statement in a warm off-white card. Then a 'My Values' section: a 2-column grid (mobile) of small cards, each with a bold value name (Service, Integrity, Inclusion, Courage, Accountability, Empathy, Excellence) and a one-line description, cards using white background with thin border-grey outline. Finish with a 'Leadership Promise' section: 3 stacked cards, each with a large gold numeral (1, 2, 3), a bold title (I Will Listen / I Will Advocate / I Will Account), and one sentence of supporting copy.</td></tr></tbody></table>

**2.4. Our Agenda (Teaser Mode)**
---------------------------------

_Must look intentionally incomplete and premium — a 'reveal is coming' state, never a broken or empty page. This is a first-class design state, not a fallback._

### **Layout, top to bottom**

*   Header: "Our Agenda" title with a small gold "Coming Soon" badge
*   Large centered teaser graphic or looping-video placeholder frame
*   Short teaser copy explaining that the full policy platform is in development, being shaped by student input
*   CTA row: "Take the Needs Survey" (primary) + "Get Notified" (secondary, optional email capture)
*   No cost/implementation detail sections visible in this mode — hidden entirely, not shown empty

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Our Agenda page in Teaser Mode, mobile-first 375px, campaign design system. Centered layout: small gold pill badge reading 'COMING SOON', large navy H2 'Our Agenda', then a large rounded navy-dark frame (16:9) with a centered play-button icon and label '[ TEASER VIDEO PENDING ]' acting as a placeholder for a short video. Below, 2 short paragraphs of teaser copy explaining the policy platform is being shaped by real student input and will be revealed soon. Two stacked buttons: gold primary 'Take the Needs Survey', navy-outline secondary 'Notify Me at Reveal'. The page should feel deliberately premium and unfinished-on-purpose — not like an empty or broken page. Do not show any policy detail, cost, or implementation sections.</td></tr></tbody></table>

**2.5. Women's Corner**
-----------------------

_A dedicated space naming issues, opportunities, resources, and support specific to women on campus._

### **Layout, top to bottom**

*   Header with short framing statement
*   4 sections, each with an icon, title, and body copy: Women's Issues, Opportunities, Resources, Support
*   Each section as a distinct card or alternating-background block for scannability

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>Section bodies render as placeholder copy per section title, clearly editable.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Women's Corner page, mobile-first 375px, campaign design system. Header: navy H2 'Women's Corner' with a one-line framing subtitle. Below, 4 stacked full-width sections with alternating white / warm-off-white backgrounds, each containing a simple line-icon in gold, a bold section title (Women's Issues, Opportunities, Resources, Support), and 2-3 lines of placeholder body copy. Keep icons simple and geometric — no decorative illustration style.</td></tr></tbody></table>

**2.6. Campaign Updates**
-------------------------

_Fully dynamic news/engagement feed — the page students return to most often._

### **Layout, top to bottom**

*   Filter/category chips row (News, Engagement, Policy Update, Speech, Media Feature, Milestone)
*   Vertical feed of update cards (image, badge, title, excerpt, date)
*   Detail view (tap-through): full cover image, title, category, date, full body copy, share row

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>Feed shows 3-4 sample cards with realistic placeholder titles until real posts are published via the CMS.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Campaign Updates listing page, mobile-first 375px, campaign design system. Header 'Campaign Updates' with a horizontally scrollable row of category filter chips (All, News, Engagement, Policy Update, Speech, Media Feature, Milestone) — active chip filled gold, inactive chips outlined navy on white. Below, a vertical feed of 4 cards, each: navy placeholder cover image, small gold category badge, bold title, one-line grey excerpt, small date label bottom-right. Also generate a second frame for the Update Detail view: full-width cover image, category badge, large title, date/author line, 3-4 paragraphs of body copy, and a small share icon row at the bottom.</td></tr></tbody></table>

**2.7. Events**
---------------

_Simple, scannable event listing — no ticketing complexity needed._

### **Layout, top to bottom**

*   Toggle or tabs: Upcoming / Past
*   Event cards: name, date, time, venue, short description, registration link button
*   Empty state for "no upcoming events" designed intentionally, not left blank

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>2-3 sample events with placeholder venue/date text.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Events page, mobile-first 375px, campaign design system. Header 'Events' with a two-tab segmented control (Upcoming / Past), active tab underlined in gold. Below, 3 stacked event cards: bold event name, a small calendar-icon row showing date and time, a location-pin icon with venue name, one line of description, and a navy-outline 'Register' button aligned right. Include a fourth, distinctly styled empty-state card for when there are no upcoming events: a simple icon, 'No upcoming events right now — check back soon' message, centered.</td></tr></tbody></table>

**2.8. Student Voice**
----------------------

_Routes students to external feedback forms and shows the campaign is listening — always live regardless of the Agenda's teaser/reveal state._

### **Layout, top to bottom**

*   Header with framing copy on why student input matters
*   Card grid: Women's Campus Needs Survey, Quick Poll, Submit a Concern, Suggest an Idea — each with icon, title, one-line description, and a button that goes live or shows "Coming Soon"

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>Cards without a saved link render in a visibly disabled "Coming soon" state — never a dead link.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Student Voice page, mobile-first 375px, campaign design system. Header 'Student Voice' with a short paragraph on why feedback matters. Below, a vertical stack of 4 cards (2-column grid on desktop): Women's Campus Needs Survey, Quick Poll, Submit a Concern, Suggest an Idea. Each card: simple line icon in navy, bold title, one-line description, and a button — 3 cards show an active gold button labelled 'Open', 1 card shows a disabled grey button labelled 'Coming Soon' with reduced opacity to demonstrate both states.</td></tr></tbody></table>

**2.9. Join the Movement**
--------------------------

_Converts interest into action — the volunteer/supporter signup._

### **Layout, top to bottom**

*   Header with a short motivating statement
*   Registration type selector (Volunteer / Campaign Team / Ambassador / Supporter)
*   Form fields: Full Name, Programme, Level, Phone, Email, Area of Interest, Skills, Availability, Motivation
*   Large, clear submit button

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Join the Movement page, mobile-first 375px, campaign design system. Header with bold navy H2 'Join the Movement' and one motivating sentence. Below, a 4-option segmented/pill selector for registration type (Volunteer, Campaign Team, Ambassador, Supporter), active option filled gold. Then a clean single-column form with labelled fields: Full Name, Programme, Level, Phone, Email, Area of Interest (dropdown), Skills (text area), Availability (dropdown), Motivation (text area) — each field with a visible label above a white input with border-grey outline and 8px radius. Full-width gold primary submit button at the bottom labelled 'Submit Registration'.</td></tr></tbody></table>

**2.1. Voices of Support**
--------------------------

_Social proof from peers and endorsers._

### **Layout, top to bottom**

*   Header with framing copy
*   Testimonial cards: photo, name, programme/role, short statement — grid on desktop, stack on mobile
*   Optional video testimonial cards distinguished with a play icon

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>1-2 placeholder testimonials shown; consent-gated so nothing publishes without confirmation (a CMS-side rule, not visual, but include a small "Verified" badge treatment to reflect the consent gate).</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Voices of Support page, mobile-first 375px, campaign design system. Header 'Voices of Support' with a short intro line. Below, a vertical stack of 2 testimonial cards, each with a small circular photo placeholder, bold name, grey programme/role line, a short italicized statement in quotes, and a small gold 'Verified' badge in the corner to indicate consent was confirmed. Include one card variant with a play-button overlay on the photo to represent a video testimonial.</td></tr></tbody></table>

**2.11. FAQ**
-------------

_Organized, credible answer bank — reduces repetitive DMs to the candidate._

### **Layout, top to bottom**

*   Category tabs or accordion groups matching: About the Candidate, Why She Is Contesting, Role of the Commissioner, Campaign Agenda, Implementation, How to Participate, How to Contact
*   Accordion-style question/answer list within each category

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>2-3 sample Q&amp;As per category shown as placeholders if the optional intake section wasn't completed.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>FAQ page, mobile-first 375px, campaign design system. Header 'Frequently Asked Questions'. Below, a vertical list of category section headers (About the Candidate, Why She Is Contesting, Role of the SRC Women's Commissioner, Campaign Agenda, How Policies Will Be Implemented, How Students Can Participate, How to Contact the Candidate), each followed by 2-3 accordion items — closed state shows a bold question with a gold chevron-down icon on a white card with border-grey outline; show one item expanded to reveal grey answer text below the question, chevron rotated to point up.</td></tr></tbody></table>

**2.12. Contact**
-----------------

_Simple, direct, and trustworthy — no dead ends._

### **Layout, top to bottom**

*   Contact channel buttons: WhatsApp, Phone, Email — large tappable buttons, not plain text
*   Office/campus location (if applicable)
*   Contact form: Name, Programme, Contact info, Enquiry Category, Message

<table><tbody><tr><td><strong>Placeholder state (until client content lands)</strong><br>Channels without a saved value render disabled with "Coming soon", never as dead links.</td></tr></tbody></table>

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Contact page, mobile-first 375px, campaign design system. Header 'Get in Touch'. Below, 3 large full-width tappable buttons stacked vertically, each with an icon + label: WhatsApp (gold fill), Call (navy-outline), Email (navy-outline). Below that, a simple contact form: Name, Programme, Contact Info, Enquiry Category (dropdown), Message (text area), each with visible labels and white inputs with border-grey outline, ending in a full-width gold 'Send Message' button.</td></tr></tbody></table>

**3\. Admin CMS — Screen Prompts**
==================================

The CMS uses the same token system but a denser, utilitarian layout — sidebar navigation, data tables, and forms rather than editorial content blocks. Generate at desktop width (1440px) first; the CMS is an internal tool, not mobile-first.

**3.1 Admin Shell & Dashboard**
-------------------------------

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Admin dashboard shell for a campaign website CMS, desktop 1440px. Left sidebar (240px, navy-dark background, white text/icons) with a logo mark at top, then nav items with simple line icons: Dashboard, Site Identity &amp; Settings, Our Agenda / Policy Hub, Women's Corner, Campaign Updates, Events, Student Voice, Join the Movement, Voices of Support, FAQ, Media Gallery, Contact Inbox, Users &amp; Permissions, Audit Log — active item highlighted with a gold left-border accent and lighter navy background. Main content area on white background: a top bar with page title and a small admin avatar/name in the corner, then a dashboard grid of 4 stat cards (Pending Approvals, Unread Contact Messages, Unread Student Voice Submissions, Current Launch Phase — shown as a status pill 'Teaser Mode') each with a bold number, label, and small icon, using white cards with border-grey outline and 12px radius.</td></tr></tbody></table>

**3.2 Site Identity & Settings**
--------------------------------

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Admin form screen: Candidate Profile editor, desktop 1440px, within the admin shell described above. A form panel (max 800px wide) with sections: Basic Info (Full Name, Display Name, Position, Institution, Programme, Level as labelled text inputs), Bio &amp; Media (Slogan text input, Short Bio textarea, Hero Photo upload dropzone with a dashed-border placeholder and 'Upload hero photo' label, About Photos multi-upload grid), and SEO (meta description textarea with character counter). Each field row shows a small orange 'Placeholder — awaiting client input' tag next to fields that are still empty. Sticky save bar at bottom: 'Save Draft' (outline) and 'Publish' (gold fill) buttons. Also generate a second panel for Launch-Phase Settings: a toggle switch labelled 'Agenda Teaser Mode' (on, gold), a toggle for 'Accountability Tracker Visible' (off, grey), and a date picker for Election Date.</td></tr></tbody></table>

**3.3 Content Management (Updates, Events, Women's Corner)**
------------------------------------------------------------

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Admin content list + editor pattern, desktop 1440px, within the admin shell. List view for Campaign Updates: a top row with a gold '+ New Update' button and a filter dropdown by status (Draft, In Review, Approved, Published, Archived); below, a data table with columns Cover (thumbnail), Title, Category (small badge), Status (colored pill: grey=draft, gold=in review, blue=approved, green=published, light-grey=archived), Author, Published Date, and a row-action menu (edit/delete). Also generate the Editor view: a two-column layout — left column (70%) with Title input, rich-text body editor (toolbar with bold/italic/link/image), Category dropdown; right column (30%) as a sidebar panel with Cover Image upload, Status dropdown, and a 'Move to Review' primary button. Use the same pattern conceptually for Events and Women's Corner Sections (swap fields accordingly: Events needs Date/Time/Venue/Registration Link; Women's Corner needs Section Title/Icon/Body).</td></tr></tbody></table>

**3.4 Engagement & Voice (Inboxes, Survey Links, FAQ)**
-------------------------------------------------------

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Admin inbox and list screens, desktop 1440px, within the admin shell. Contact Inbox: a data table with columns Name, Enquiry Category, Message (truncated), Status (pill: new=gold, read=grey, responded=green, archived=light-grey), Submitted Date, sortable by date, with a status filter row above the table. Student Voice Inbox: same pattern with a Type column (Concern / Idea badge). Survey Links manager: a simple table with Form Name, Platform, URL, Status toggle (Live / Coming Soon), and an edit icon per row. FAQ manager: grouped by category as collapsible sections, each containing a reorderable list of Q&amp;A rows with drag handles and edit/delete icons, plus a '+ Add Question' button per category.</td></tr></tbody></table>

**3.5 Media, Testimonials & Volunteers**
----------------------------------------

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Admin management screens, desktop 1440px, within the admin shell. Media Gallery: a masonry/grid of uploaded image thumbnails with a '+ Upload' dropzone tile first in the grid; hovering a thumbnail reveals a caption input and alt-text input overlay (alt-text field marked required with a small red asterisk). Voices of Support (testimonials) list: cards in a grid, each showing photo thumbnail, name, truncated statement, and a consent checkbox state shown as a badge ('Consent Confirmed' green / 'Awaiting Consent' grey) — the Publish button is visibly disabled (greyed out) on any card where consent isn't confirmed. Volunteer Registrations: a dense data table with columns Full Name, Programme, Registration Type (badge), Phone, Email, Area of Interest, Submitted Date, a filter dropdown by Registration Type, and an 'Export CSV' button top-right.</td></tr></tbody></table>

**3.6 Users, Permissions & Audit Log**
--------------------------------------

<table><tbody><tr><td><strong>PASTE-READY PROMPT</strong><br>Admin settings screens, desktop 1440px, within the admin shell. Users &amp; Permissions: a table listing admin users with columns Name, Email, Role Label (e.g. Communications Lead), Permission Scopes (shown as small stacked badges: manage_updates, manage_media, etc.), and an edit icon; a gold '+ Invite Admin' button top-right opens a side panel with Name/Email inputs and a checklist of permission scope toggles. Audit Log: a simple chronological read-only list — each row shows a small icon by action type, actor name, action description ('published Campaign Update: Campus Town Hall'), and a relative timestamp, with a date-range filter at the top.</td></tr></tbody></table>

**4\. Anti-Generic Checklist**
==============================

Run every generated screen against this list before accepting it. If any box is ticked, regenerate or manually fix that element.

*   Glassmorphism or frosted-glass panels anywhere
*   Gradient blobs or abstract blob shapes as background decoration
*   Every single button rendered as a fully-rounded pill (buttons should be 8-16px radius rectangles; only small tag/badge chips are pill-shaped)
*   Scroll-fade-in animation implied on every section (fine as a one-off on the hero, not everywhere)
*   Cursor-following gradient beams or spotlight effects
*   Grain/noise texture layered over a gradient as a stylistic dress-up
*   Italic serif decorative accents on headings
*   Space Grotesk + Instrument Serif font pairing (the new generic default to avoid)
*   Generic 3D illustration or stock-photo-style hero art instead of the labelled placeholder blocks specified in each prompt
*   Gold used as a large fill (backgrounds, big panels) rather than as a sparing accent

<table><tbody><tr><td><strong>Reminder</strong><br>The prompts in §2 and §3 reference specific real component patterns (editorial pull-quotes, segmented tabs, status-pill tables) rather than naming a specific product to copy wholesale — extract the underlying pattern, not a visual skin.</td></tr></tbody></table>