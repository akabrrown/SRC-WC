<table><tbody><tr><td><strong>SRC WOMEN'S COMMISSIONER CAMPAIGN</strong><br><strong>Technical &amp; CMS Specification</strong><br><strong>Public Website + Admin CMS</strong><br><em>Brand Palette: UPSA Navy &amp; Gold | Development Starts Now — Static Content Pending</em><br>Document Version: 1.0 | Status: In Development<br>Companion to: Website Content &amp; Development Blueprint v1.0 · Launch Content Checklist v1.0</td></tr></tbody></table>

**Table of Contents**
=====================

**0\. Overview & Scope**
========================

This is the Technical & CMS Specification for the SRC Women's Commissioner campaign website. It covers the complete system — public-facing site and the Admin CMS that powers it — so that development can start immediately using the launch-phase teaser structure from the blueprint, while the static content requested in the Website Launch Content & Static Information Checklist (v1.0) is still with the client.  
Everything that depends on client-supplied content (candidate name, photos, final vision/mission copy, social handles, survey links) is built as a CMS-editable field with a clearly labelled placeholder, not hard-coded — so the site can go from placeholder to real content without a redeploy once the client responds.

<table><tbody><tr><td><strong>Companion documents</strong><br>SRC Women's Commissioner — Website Content &amp; Development Blueprint v1.0 (client-supplied structure)<br>Website Launch Content &amp; Static Information Checklist v1.0 (submitted to client, response pending)</td></tr></tbody></table>

**1\. Brand & Visual Identity**
===============================

Colour palette is built from UPSA's institutional brand, since the campaign is UPSA-affiliated and no separate campaign brand kit has been supplied yet. Values below were pulled from UPSA's public brand assets — confirm against the university's official brand manual if the campaign wants to deviate for differentiation (e.g. a lighter tint for campaign-only surfaces, keeping navy/gold as the anchor).

<table><tbody><tr><td></td><td><strong>#00004E</strong></td><td>UPSA Navy (Stratos)</td><td>Primary — header, nav, footer, primary buttons, links</td></tr><tr><td></td><td><strong>#C69500</strong></td><td>UPSA Gold (Buddha Gold)</td><td>Accent — CTAs, highlights, active states, badges</td></tr><tr><td></td><td><strong>#FFFFFF</strong></td><td>White</td><td>Page background, text on navy</td></tr><tr><td></td><td><strong>#1A1A1A</strong></td><td>Ink (supporting)</td><td>Body text — not from UPSA marks, added for readability</td></tr><tr><td></td><td><strong>#F4F1EA</strong></td><td>Warm Grey (supporting)</td><td>Section backgrounds, card fills — added for contrast</td></tr><tr><td></td><td><strong>#E5E5E0</strong></td><td>Border Grey (supporting)</td><td>Dividers, input borders — added, neutral</td></tr></tbody></table>

The three supporting neutrals are not from the UPSA mark — they are added because a two-colour institutional palette (navy + gold) is not enough on its own to build accessible text, card, and form UI. They stay strictly neutral so navy and gold keep doing all the identity work.

**Typography**
--------------

*   Headings: Inter or Poppins (SemiBold/Bold) — clean, campus-appropriate, high mobile legibility
*   Body: Inter (Regular/Medium)
*   Numerals in stat callouts (e.g. Women's Corner, Impact section): tabular figures for alignment

Swap in the official UPSA typeface only if the university's brand manual mandates one for sub-brand/affiliated sites — otherwise Inter ships as a strong free-tier default (self-hosted via next/font, zero external request).

**Anti-generic direction**
--------------------------

*   No glassmorphism, gradient blobs, or uniform pill buttons — a campaign site for a student leadership race should read as credible and editorial, not like a SaaS landing page.
*   No generic stock 3D illustrations — use real campaign photography once supplied; ship with clean typographic placeholders (not illustration placeholders) until then.
*   Navy dominates large surfaces; gold is used sparingly as an accent so it doesn't read as a "warning" colour against navy.

**2\. Technology Stack**
========================

Standard stack, consistent with the rest of the portfolio — free-tier-first with documented upgrade triggers.

| **Layer** | **Choice** | **Notes** |
| --- | --- | --- |
| Frontend | Next.js 14 (App Router) + TypeScript | SSR for SEO on public pages; ISR for Campaign Updates/Events |
| Styling | Tailwind CSS + shadcn/ui | UPSA palette as Tailwind theme tokens (see §3) |
| Backend/DB | Supabase (PostgreSQL + Auth + RLS) | Single project; RLS enforces public read / admin write |
| Media | Cloudinary | Signed uploads for CMS; transformations for responsive images |
| Email | Resend | Contact form + volunteer registration notification emails |
| Rate limiting | Arcjet + Upstash Redis | Protects public forms (Contact, Volunteer, Student Voice) from bot abuse |
| Hosting | Vercel | Free tier at launch; documented upgrade trigger in §7 |

**3\. Design Tokens (Tailwind Theme Extract)**
==============================================

For direct use in tailwind.config — keeps the UPSA palette centrally defined rather than hard-coded per component.  
colors: { brand: { navy: "#00004E", navyDark: "#00002E", gold: "#C69500", }, ink: "#1A1A1A", surface: "#FFFFFF", muted: "#F4F1EA", border: "#E5E5E0", }

**4\. Information Architecture**
================================

Recap of the approved sitemap from the blueprint, annotated with content source — this drives both the public route map and the CMS module list in §6.

| **Page** | **Content Source** | **CMS Module** |
| --- | --- | --- |
| Home | Static + CMS mix | Site Identity, Campaign Updates (latest 3), Student Voice card |
| Meet the Candidate | Static (one-time) | Candidate Profile |
| My Vision | Static (one-time) | Vision & Values |
| Our Agenda | CMS-gated (teaser ↔ full) | Launch Settings, Policy Hub (locked pre-reveal) |
| Women's Corner | CMS | Women's Corner Sections |
| Campaign Updates | CMS, fully dynamic | Campaign Updates |
| Events | CMS, fully dynamic | Events |
| Student Voice | Static links + CMS inbox | Survey Links, Student Voice Inbox |
| Join the Movement | Static form + CMS records | Volunteer Registrations |
| Voices of Support | CMS | Testimonials |
| FAQ | CMS | FAQ |
| Contact | Static channels + CMS inbox | Contact Channels, Contact Inbox |

**5\. Database Schema (Supabase / PostgreSQL)**
===============================================

Grouped by function. All tables use RLS: public (anon) role gets SELECT on published/live content only; INSERT-only on the three public-write tables (contact\_submissions, student\_voice\_submissions, volunteer\_registrations); the authenticated admin role gets full CRUD gated additionally by the permission\_scope described in §8.

**5.1 Identity & Settings (singleton rows)**
--------------------------------------------

| **Table** | **Key Fields** | **Notes** |
| --- | --- | --- |
| candidate\_profile | full\_name, display\_name, position\_title, institution\_name, programme, level, slogan, short\_bio, hero\_photo\_url, about\_photo\_urls (jsonb\[\]), favicon\_url, seo\_description | One row. Ships with placeholder text flagged isPlaceholder until checklist §1 is returned |
| site\_settings | agenda\_teaser\_mode (bool, default true), accountability\_tracker\_visible (bool, default false), teaser\_video\_url, election\_date, ga\_id, meta\_pixel\_id, domain | One row. Drives §9 launch-phase logic |
| vision\_content | vision\_statement, mission\_statement | One row. Placeholder text until checklist §2 confirmed |
| brand\_assets | logo\_url, color\_overrides (jsonb), typography\_notes | One row. Defaults to §1 UPSA palette until overridden |
| contact\_channels | whatsapp\_number, phone\_number, email, office\_location, contact\_form\_recipient\_email, volunteer\_recipient\_email | One row |

**5.2 Structured Lists**
------------------------

| **Table** | **Key Fields** | **Notes** |
| --- | --- | --- |
| values | id, title, description, sort\_order | "My Values" chips — Service, Integrity, etc. |
| leadership\_promises | id, title, description, sort\_order | Default 3 (Listen/Advocate/Account); editable |
| social\_links | id, platform (enum), url, visible (bool) | Instagram, TikTok, Facebook, X, LinkedIn, WhatsApp, YouTube |
| survey\_links | id, form\_name, platform, url, status (live / coming\_soon) | Student Voice external form cards |
| womens\_corner\_sections | id, title, body, icon, sort\_order, status | Women's Issues / Opportunities / Resources / Support |

**5.3 Dynamic Content (workflow-managed)**
------------------------------------------

| **Table** | **Key Fields** | **Notes** |
| --- | --- | --- |
| campaign\_updates | id, title, slug, category (enum: news / engagement / policy\_update / speech / media\_feature / milestone), body, cover\_image\_url, author\_id, status, published\_at | Status: draft → in\_review → approved → published → archived |
| events | id, name, event\_date, event\_time, venue, description, registration\_link, status | Same status workflow |
| testimonials | id, name, programme\_role, statement, photo\_url, video\_url, consent\_confirmed (bool, required true to publish), status | Publish blocked at DB level unless consent\_confirmed = true |
| faq\_items | id, category (enum, matches blueprint §12 list), question, answer, sort\_order, status | Same status workflow |
| media\_gallery | id, media\_type (photo/video), url, caption, event\_id (nullable FK), sort\_order | Cloudinary-hosted |
| policy\_items | id, title, summary, issue\_statement, solution, why\_it\_matters, implementation\_plan, timeline, partners, cost\_notes, beneficiaries, success\_indicators, video\_url, document\_url, status | Table exists at launch but stays empty/locked while agenda\_teaser\_mode = true |

**5.4 Public Submissions (write-only for anon role)**
-----------------------------------------------------

| **Table** | **Key Fields** | **Notes** |
| --- | --- | --- |
| contact\_submissions | id, name, programme, contact, enquiry\_category, message, status (new/read/responded/archived), created\_at | Matches blueprint §13 form fields |
| student\_voice\_submissions | id, type (concern/idea), name (nullable), programme (nullable), message, status, created\_at | Powers "Submit a Concern" / "Suggest an Idea" if built natively instead of via external form |
| volunteer\_registrations | id, full\_name, programme, level, phone, email, area\_of\_interest, skills, availability, motivation, registration\_type (volunteer / campaign\_team / ambassador / supporter), created\_at | Matches blueprint §10 field list |

**5.5 Admin & Governance**
--------------------------

| **Table** | **Key Fields** | **Notes** |
| --- | --- | --- |
| admin\_users | id (auth.users FK), name, email, role\_label, permission\_scope (text\[\]) | See §8 for permission scopes and their mapping to the governance table |
| audit\_log | id, admin\_user\_id, action, entity, entity\_id, created\_at | Append-only; every publish/approve/delete is logged |

**6\. Roles & Permissions**
===========================

Design decision: a single Admin role type in Supabase Auth, not a proliferation of named database roles — consistent with the role-simplicity approach used across the portfolio. "Campaign Manager", "Communications Lead", etc. are labels plus a permission\_scope array on admin\_users, not separate access-control roles. This keeps RLS policies simple (authenticated + scope check) while still letting the CMS UI hide/show modules per person.

| **Permission Scope** | **Grants Access To** | **Maps to Governance Role (blueprint §16)** |
| --- | --- | --- |
| manage\_settings | Site Settings, Launch-Phase toggle, Brand Assets | Digital / ICT Team, approved by Campaign Manager |
| manage\_identity | Candidate Profile, Vision & Values | Communications Team, approved by Candidate/Campaign Manager |
| manage\_policy | Policy Hub (unlocked post-reveal) | Policy & Research Team, approved by Candidate/Campaign Manager |
| manage\_updates | Campaign Updates | Communications Team, approved by Communications Lead |
| manage\_media | Media Gallery, cover images | Media / Creative Team, approved by Communications Lead |
| manage\_events | Events | Events Team, approved by Campaign Manager |
| manage\_voice | Student Voice Inbox, Survey Links, FAQ | Research & Engagement Team, approved by Campaign Manager |
| manage\_volunteers | Volunteer Registrations, exports | Mobilisation Team, approved by Campaign Manager |
| manage\_users | Admin Users, permission scopes | Digital / ICT Team lead only |
| publish | Moves any content from approved → published (final gate) | Held by Campaign Manager / Communications Lead per content area |

**7\. Non-Functional Requirements**
===================================

**7.1 Mobile-First & Accessibility (blueprint §15)**
----------------------------------------------------

*   Mobile-first layout; all CTAs (WhatsApp, phone, email) rendered as tappable buttons, not plain text
*   WCAG 2.1 AA colour contrast — navy-on-white and white-on-navy both pass; gold is never used as body text on white
*   Alt text required at CMS level — image upload fields block publish without alt text
*   Forms use native labels, visible error states, and large touch targets (min. 44×44px)

**7.2 Performance**
-------------------

*   Images served via Cloudinary responsive transformations; no unoptimised uploads reach the DOM
*   Campaign Updates & Events use ISR (revalidate on publish) rather than full static rebuilds

**7.3 Security**
----------------

*   Arcjet + Upstash rate limiting on all three public-write endpoints (Contact, Student Voice, Volunteer)
*   RLS: anon role has zero write access outside the three public-submission tables, and zero read access to unpublished content
*   Consent gate at the database level on testimonials.consent\_confirmed, not just a UI checkbox

**7.4 Free-Tier Infrastructure & Upgrade Triggers**
---------------------------------------------------

| **Service** | **Free Tier Ceiling** | **Upgrade Trigger** |
| --- | --- | --- |
| Vercel | 100GB bandwidth/mo | Sustained traffic near ceiling in analytics, or need for team collaboration features |
| Supabase | 500MB DB, 1GB storage | Media gallery volume or submission volume approaching limits |
| Cloudinary | 25 credits/mo | High-frequency gallery uploads around events/debates |
| Resend | 3,000 emails/mo | High volume of contact/volunteer submissions near election period |

**8\. Admin CMS Specification**
===============================

Screens are grouped to match the governance table in the blueprint (§16), so each team only sees the modules relevant to their permission\_scope.

**8.1 Dashboard**
-----------------

*   Pending-approval counts per content type (Updates, Events, Testimonials, FAQ)
*   Unread Contact and Student Voice submission counts
*   Current launch-phase state banner ("Agenda: Teaser Mode" / "Agenda: Revealed")

**8.2 Site Identity & Settings — scope: manage\_settings, manage\_identity**
----------------------------------------------------------------------------

| **Screen** | **Purpose** |
| --- | --- |
| Candidate Profile | Edit name, position, bio, hero/about photos — flags remaining placeholder fields until checklist §1 lands |
| Vision & Values | Edit vision/mission statements, values list, leadership promises |
| Branding | Upload campaign logo (if different from UPSA-only), override palette tokens if approved |
| Launch-Phase Settings | Toggle agenda\_teaser\_mode, accountability\_tracker\_visible, set teaser video, election date |

**8.3 Our Agenda / Policy Hub — scope: manage\_policy**
-------------------------------------------------------

While agenda\_teaser\_mode = true, this module shows only the teaser copy editor (blueprint §6 recommended launch copy) and stays locked from creating policy\_items. Once toggled off (post official reveal), the five-section policy builder unlocks, matching the blueprint's Future Policy Page Visual Structure (Issue → Solution → Implementation → Resources → Impact).

**8.4 Women's Corner — scope: manage\_identity**
------------------------------------------------

*   CRUD for womens\_corner\_sections: Women's Issues, Opportunities, Resources, Support — each with icon, title, body, sort order

**8.5 Campaign Updates — scope: manage\_updates**
-------------------------------------------------

*   Create/edit posts with category tagging (News, Engagement, Policy Update, Speech, Media Feature, Milestone)
*   Draft → In Review → Approved → Published → Archived workflow with visible status pill
*   Cover image upload via Cloudinary widget, alt text required

**8.6 Events — scope: manage\_events**
--------------------------------------

*   Event cards: Name, Date, Time, Venue, Description, Registration Link — matches blueprint §9 exactly
*   Calendar and list view; past events auto-archive

**8.7 Student Voice — scope: manage\_voice**
--------------------------------------------

*   Survey Links manager — form name, platform, URL, live/coming-soon status
*   Submissions inbox for Concern/Idea entries (if captured natively) with status (new/read/responded/archived)

**8.8 Join the Movement — scope: manage\_volunteers**
-----------------------------------------------------

*   Table of registrations (Full Name, Programme, Level, Phone, Email, Area of Interest, Skills, Availability, Motivation)
*   Filter by registration\_type; CSV export for the Mobilisation Team

**8.9 Voices of Support — scope: manage\_identity or manage\_updates (assignable)**
-----------------------------------------------------------------------------------

*   CRUD for testimonials — publish button disabled until consent\_confirmed is checked

**8.10 FAQ — scope: manage\_voice**
-----------------------------------

*   CRUD grouped by the seven blueprint categories (§12); drag-to-reorder within category

**8.11 Media Gallery — scope: manage\_media**
---------------------------------------------

*   Bulk upload via Cloudinary; optional link to an Event; caption + required alt text per item

**8.12 Contact Inbox — scope: manage\_voice**
---------------------------------------------

*   List of contact\_submissions with status workflow (new → read → responded → archived)
*   Resend-powered notification email fires to contact\_form\_recipient\_email on new submission

**8.13 Users & Permissions — scope: manage\_users**
---------------------------------------------------

*   Invite admin users, assign role\_label + permission\_scope checkboxes from §6

**8.14 Audit Log — read-only, all admin roles**
-----------------------------------------------

*   Chronological feed of publish/approve/delete actions with actor and timestamp

**9\. Launch-Phase Configuration Logic**
========================================

Directly implements the blueprint's Launch Phase vs. Policy Reveal Phase table (§17), driven entirely by site\_settings so no redeploy is needed to flip phases.

| **Setting** | **Teaser Mode (default at launch)** | **After Toggle Off (Policy Reveal)** |
| --- | --- | --- |
| Our Agenda page | Renders static teaser copy + CTA buttons | Renders policy\_items list + individual policy pages |
| Implementation / Cost fields | Hidden entirely, not just empty | Rendered per policy\_items |
| Accountability Tracker | Hidden unless accountability\_tracker\_visible = true (optional placeholder state) | Active — tracks adopted policy commitments |
| Student Voice | Always live regardless of this toggle | Always live — continues collecting feedback for accountability |

<table><tbody><tr><td><strong>Key design principle carried over from the blueprint</strong><br>The Agenda section must look intentionally incomplete — premium and "reveal is coming" — never like an empty or broken page. The teaser template is a first-class design state, not a fallback.</td></tr></tbody></table>

**10\. Open Items Pending Client Response**
===========================================

Development proceeds now on architecture, CMS, and the design system below. These fields ship as clearly flagged placeholders and swap in as soon as the Website Launch Content & Static Information Checklist v1.0 comes back.

| **Blocked Item** | **Checklist Reference** | **Current Placeholder Behaviour** |
| --- | --- | --- |
| Candidate name, photos, bio | Checklist §1 | Hero renders with a name placeholder and neutral silhouette graphic, not a fake photo |
| Vision / Mission copy | Checklist §2 | Section renders with clearly labelled "Draft pending approval" copy |
| Campaign logo & palette override | Checklist §3 | Falls back to UPSA navy/gold (§1 of this document) |
| Contact channels | Checklist §4 | Contact buttons render disabled with "Coming soon" state rather than dead links |
| Social handles | Checklist §5 | Only platforms with a saved URL render an icon — no broken links |
| Survey/form links | Checklist §6 | Student Voice cards show "Coming soon" until a live URL is saved |
| Domain & tracking IDs | Checklist §7 | Deploys on a Vercel preview subdomain until domain is confirmed |
| Governance contacts / CMS users | Checklist §8 | Single temporary admin account provisioned for Aka's build/QA use |

**11\. Next Steps**
===================

*   Scaffold Next.js + Supabase project; apply schema from §5 with RLS policies
*   Build design tokens (§3) and core layout shell in UPSA navy/gold
*   Build CMS modules in priority order: Site Identity & Settings → Campaign Updates → Events → Student Voice → Voices of Support → FAQ → Media Gallery
*   Wire public pages against live CMS data with placeholder fallbacks per §10
*   Swap placeholders for real content the moment the checklist response arrives — no rebuild of structure required

<table><tbody><tr><td><strong>Handoff note</strong><br>Once static content is confirmed, the next documents in sequence are the Operational Workflow Guide (day-to-day admin journeys) and the Figma Prompt Library for visual design — both can start in parallel with development.</td></tr></tbody></table>