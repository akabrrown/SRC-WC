import { describe, it, expect } from 'vitest';
import { db } from '../src/db/database.js';
import { requirePermissionScope, AuthenticatedRequest } from '../src/middlewares/auth.js';

describe('SRC Women\'s Commissioner Campaign Core Business Rules', () => {
  it('enforces testimonial consent gate before publishing', () => {
    // Attempting to publish without confirmed consent must throw
    expect(() => {
      db.addTestimonial({
        name: 'Student Supporter',
        programme_role: 'Level 200 Admin',
        statement: 'Great advocate for our campus.',
        consent_confirmed: false,
        status: 'published'
      });
    }).toThrow(/consent_confirmed must be true/);

    // Draft with unconfirmed consent is allowed
    const draft = db.addTestimonial({
      name: 'Student Supporter',
      programme_role: 'Level 200 Admin',
      statement: 'Great advocate for our campus.',
      consent_confirmed: false,
      status: 'draft'
    });
    expect(draft.id).toBeDefined();
    expect(draft.status).toBe('draft');

    // Updating draft to published without consent must throw
    expect(() => {
      db.updateTestimonial(draft.id, { status: 'published' });
    }).toThrow(/consent_confirmed must be true/);

    // Updating with consent succeeds
    const published = db.updateTestimonial(draft.id, { 
      consent_confirmed: true, 
      status: 'published' 
    });
    expect(published?.status).toBe('published');
    expect(published?.consent_confirmed).toBe(true);
  });

  it('enforces agenda teaser mode gating on policy item creation', () => {
    // Ensure teaser mode is on
    db.updateSiteSettings({ agenda_teaser_mode: true });
    expect(db.getSiteSettings().agenda_teaser_mode).toBe(true);

    // Attempting to create a policy item while in teaser mode must throw
    expect(() => {
      db.addPolicyItem({
        title: 'Premature Policy',
        summary: 'Should not be allowed in teaser mode',
        issue_statement: 'Unrevealed issue',
        solution: 'Unrevealed solution',
        why_it_matters: 'Integrity',
        status: 'draft'
      });
    }).toThrow(/locked in Teaser Mode/);

    // Public list of policies must be empty while in teaser mode
    const publicPolicies = db.getPolicies(true);
    expect(publicPolicies.length).toBe(0);

    // Toggle off teaser mode (reveal phase)
    db.updateSiteSettings({ agenda_teaser_mode: false });
    const policy = db.addPolicyItem({
      title: 'Revealed Policy Platform Item',
      summary: 'Now allowed after launch reveal',
      issue_statement: 'Documented transit issue',
      solution: 'Campus shuttle extension',
      why_it_matters: 'Student safety',
      status: 'published'
    });
    expect(policy.id).toBeDefined();

    // Reset back to teaser mode for initial launch state
    db.updateSiteSettings({ agenda_teaser_mode: true });
  });

  it('enforces mandatory alt text on media gallery uploads', () => {
    expect(() => {
      db.addMediaItem({
        media_type: 'photo',
        url: 'https://cloudinary.com/sample.jpg',
        alt_text: '   ',
        sort_order: 1
      });
    }).toThrow(/alt_text is mandatory/);

    const validMedia = db.addMediaItem({
      media_type: 'photo',
      url: 'https://cloudinary.com/sample.jpg',
      caption: 'Candidate speaking at Town Hall',
      alt_text: 'Candidate addressing female students at the LBC auditorium',
      sort_order: 1
    });
    expect(validMedia.id).toBeDefined();
    expect(validMedia.alt_text).toBe('Candidate addressing female students at the LBC auditorium');
  });

  it('verifies permission scope authorization middleware', () => {
    const middleware = requirePermissionScope('manage_policy');
    
    // User without manage_policy scope
    const reqWithoutScope: Partial<AuthenticatedRequest> = {
      admin: {
        id: 'adm-2',
        name: 'Junior Assistant',
        email: 'junior@upsa.org',
        role_label: 'Events Assistant',
        permission_scope: ['manage_events'],
        created_at: new Date().toISOString()
      }
    };

    let statusCode = 0;
    let responseData: any = null;
    const res: any = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => {
            responseData = data;
          }
        };
      }
    };

    let nextCalled = false;
    middleware(reqWithoutScope as AuthenticatedRequest, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(statusCode).toBe(403);
    expect(responseData?.title).toBe('Forbidden');

    // User with manage_policy scope
    const reqWithScope: Partial<AuthenticatedRequest> = {
      admin: {
        id: 'adm-1',
        name: 'Lead Admin',
        email: 'lead@upsa.org',
        role_label: 'Campaign Manager',
        permission_scope: ['manage_policy', 'manage_settings'],
        created_at: new Date().toISOString()
      }
    };

    nextCalled = false;
    middleware(reqWithScope as AuthenticatedRequest, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });
});
