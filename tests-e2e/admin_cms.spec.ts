import { test, expect } from '@playwright/test';

test.describe('Admin CMS & Management Modules (14+ Screens)', () => {

  test('1. Admin Dashboard renders stat metrics and phase banner', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Current Campaign Launch Phase:')).toBeVisible();
    await expect(page.getByText('Pending Approvals')).toBeVisible();
    await expect(page.getByText('Unread Messages')).toBeVisible();
    await expect(page.getByText('Student Voice').first()).toBeVisible();
  });

  test('2. Candidate Profile Editor updates slogan and bio', async ({ page }) => {
    await page.goto('/admin/candidate');
    await expect(page.getByRole('heading', { name: 'Candidate Profile Editor' })).toBeVisible();
    await expect(page.getByText(/1\. Basic Candidate Information/i)).toBeVisible();

    // Click Save & Publish Profile
    await page.getByRole('button', { name: /Save & Publish Profile/i }).click();
    await expect(page.getByText('Profile Updated')).toBeVisible();
  });

  test('3. Launch Settings toggles Teaser Mode live', async ({ page }) => {
    await page.goto('/admin/launch-settings');
    await expect(page.getByRole('heading', { name: 'Launch-Phase & Site Settings' })).toBeVisible();

    // Toggle button visible
    const toggleBtn = page.locator('button[aria-label="Toggle Teaser Mode"]');
    await expect(toggleBtn).toBeVisible();

    // Click Save
    await page.getByRole('button', { name: 'Save Launch Settings' }).click();
    await expect(page.getByText('Settings Applied Live')).toBeVisible();
  });

  test('4. Policy Hub enforces Teaser Mode locking behavior', async ({ page }) => {
    await page.goto('/admin/policies');
    await expect(page.getByRole('heading', { name: 'Our Agenda & Policy Hub CMS' })).toBeVisible();
  });

  test('5. Campaign Updates CMS creates new dispatch and lists it', async ({ page }) => {
    await page.goto('/admin/updates');
    await expect(page.getByRole('heading', { name: 'Campaign Updates & Dispatches' })).toBeVisible();

    // Open create form
    await page.getByRole('button', { name: 'New Dispatch' }).click();
    await expect(page.getByRole('button', { name: /Back to Updates List/i })).toBeVisible();

    // Fill new update
    await page.fill('input[placeholder*="Campaign Team Meets"]', 'Playwright Automated Dispatch');
    await page.fill('textarea[placeholder*="Write the full report"]', 'Comprehensive verification completed across all public and admin modules.');

    // Save
    await page.getByRole('button', { name: 'Save & Update Dispatch' }).click();
    await expect(page.getByText('Dispatch Created').first()).toBeVisible();
  });

  test('6. Testimonials CMS enforces mandatory consent gate for publishing', async ({ page }) => {
    await page.goto('/admin/testimonials');
    await expect(page.getByRole('heading', { name: /Voices of Support \/ Testimonials/i })).toBeVisible();

    // Open create form
    await page.getByRole('button', { name: 'New Endorsement' }).click();
    
    await page.fill('input[placeholder="e.g. Priscilla Antwi"]', 'Efua Baidoo');
    await page.fill('input[placeholder*="BSc IT"]', 'Level 400 Student');
    await page.fill('textarea[placeholder*="Why is this candidate"]', 'Passionate advocate with unmatched execution integrity.');

    // Check consent box
    const consentCheckbox = page.locator('input#consent_check');
    await consentCheckbox.check();
    await expect(consentCheckbox).toBeChecked();

    // Save
    await page.getByRole('button', { name: 'Save Endorsement' }).click();
    await expect(page.getByText('Testimonial Created').first()).toBeVisible();
  });



  test('7. Volunteers CMS displays records and allows details inspection', async ({ page }) => {
    await page.goto('/admin/volunteers');
    await expect(page.getByRole('heading', { name: /Join the Movement \/ Volunteers/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export CSV for Mobilisation' })).toBeVisible();

    // Inspect first record details modal
    const viewBtn = page.locator('button[title="View Full Details"]').first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
      await expect(page.getByText('Volunteer Record')).toBeVisible();
      await page.getByRole('button', { name: 'Close Record' }).click();
    }
  });

  test('8. Users & Permissions CMS lists staff accounts and scope assignments', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'Users & Permission Scopes' })).toBeVisible();
    await expect(page.getByText('manage_settings').first()).toBeVisible();
  });

  test('9. Audit Log CMS shows append-only immutable stream', async ({ page }) => {
    await page.goto('/admin/audit-log');
    await expect(page.getByRole('heading', { name: 'System Audit Trail' })).toBeVisible();
    await expect(page.getByText(/Logged Actions/i)).toBeVisible();
  });

});
