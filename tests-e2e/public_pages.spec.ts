import { test, expect } from '@playwright/test';

test.describe('Public Campaign Website (12 Pages)', () => {

  test('1. Home Page renders core branding and dispatches', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SRC Women's Commissioner Campaign/i);
    
    // Check navigation brand mark
    await expect(page.locator('header')).toBeVisible();

    // Check Hero CTA button
    const joinBtn = page.getByRole('link', { name: 'Join the Movement' }).first();
    await expect(joinBtn).toBeVisible();

    // Check Values strip
    await expect(page.getByText(/Our Core Values:/i)).toBeVisible();

    // Check Updates Feed section
    await expect(page.getByRole('heading', { name: /Campaign Updates/i })).toBeVisible();
  });

  test('2. Meet the Candidate Page renders story and profile', async ({ page }) => {
    await page.goto('/meet-the-candidate');
    await expect(page.getByRole('heading', { name: 'Meet the Candidate' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'My Story' })).toBeVisible();
    await expect(page.getByText(/campaign photo/i).first()).toBeVisible();
  });

  test('3. My Vision Page renders statements and values', async ({ page }) => {
    await page.goto('/my-vision');
    await expect(page.getByRole('heading', { name: /Vision, Mission & Promises/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /My Core Values/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Leadership Promises/i })).toBeVisible();
  });

  test('4. Our Agenda Page renders first-class Teaser Mode', async ({ page }) => {
    await page.goto('/our-agenda');
    await expect(page.getByText(/COMING SOON/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Our Agenda' })).toBeVisible();
    await expect(page.getByText(/TEASER VIDEO/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Take the Needs Survey/i })).toBeVisible();
  });

  test('5. Women\'s Corner Page renders 4 foundational welfare sections', async ({ page }) => {
    await page.goto('/womens-corner');
    await expect(page.getByRole('heading', { name: /Women's Corner/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Women's Issues" })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Opportunities" })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Resources" })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Support" })).toBeVisible();
  });

  test('6. Campaign Updates Feed & Article Detail', async ({ page }) => {
    await page.goto('/updates');
    await expect(page.getByRole('heading', { name: /Campaign Updates & News/i })).toBeVisible();
    
    // Check Category filter pills
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'News', exact: true })).toBeVisible();

    // Click first article to view details
    await expect(page.locator('article').first()).toBeVisible();
    const readBtn = page.locator('article a', { hasText: 'Read' }).first();
    await readBtn.click();
    await page.waitForURL(/\/updates\/.+/);
    await expect(page.getByText(/Share this dispatch/i)).toBeVisible();
  });

  test('7. Events Page renders schedule and tabs', async ({ page }) => {
    await page.goto('/events');
    await expect(page.getByRole('heading', { name: /Campaign Events & Townhalls/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Upcoming/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Past Engagements/i })).toBeVisible();
  });

  test('8. Student Voice Hub allows concern submission', async ({ page }) => {
    await page.goto('/student-voice');
    await expect(page.getByRole('heading', { name: /Student Voice & Feedback Hub/i })).toBeVisible();
    
    // Open Submit a Concern Modal
    await page.getByRole('button', { name: 'Submit a Concern' }).click();
    await expect(page.getByRole('heading', { name: 'Submit a Campus Concern' })).toBeVisible();

    // Fill form and submit
    await page.fill('textarea', 'Need better lighting near the hostel walkway for late night study sessions.');
    await page.getByRole('button', { name: /Send campus concern|Submit Now/i }).click();

    // Verify submission feedback
    await expect(page.getByText(/Thank You for Speaking Up/i)).toBeVisible();
  });

  test('9. Join the Movement allows volunteer registration', async ({ page }) => {
    await page.goto('/join-the-movement');
    await expect(page.getByRole('heading', { name: 'Join the Movement' })).toBeVisible();

    // Select role
    await page.getByText('Campus Volunteer').click();

    // Fill contact details
    await page.fill('input[placeholder="e.g. Abena Mensah"]', 'Akua Serwaa');
    await page.fill('input[placeholder="e.g. 0244 000 000"]', '0244111222');
    await page.fill('input[placeholder="e.g. student@upsamail.edu.gh"]', 'akua.serwaa@upsamail.edu.gh');
    await page.fill('input[placeholder*="BSc Business Administration"]', 'BSc Information Technology');

    // Submit
    await page.getByRole('button', { name: /Register as volunteer|Submit Registration/i }).click();

    // Verify success banner
    await expect(page.getByText(/Welcome to the Campaign Team/i)).toBeVisible();
  });

  test('10. Voices of Support renders verified testimonials', async ({ page }) => {
    await page.goto('/voices-of-support');
    await expect(page.getByRole('heading', { name: 'Voices of Support' })).toBeVisible();
    await expect(page.getByText(/Verified Consent/i).first()).toBeVisible();
  });

  test('11. FAQ Page accordion expands and collapses', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();

    // Click first accordion button in FAQ cards
    const firstAccordionBtn = page.locator('.campaign-card button[aria-expanded]').first();
    await expect(firstAccordionBtn).toBeVisible();
    await firstAccordionBtn.click();
    await expect(firstAccordionBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('12. Contact Page delivers student message', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: 'Get in Touch' })).toBeVisible();
    
    // Action buttons visible
    await expect(page.getByText(/WhatsApp/i).first()).toBeVisible();

    // Fill contact form
    await page.fill('input[placeholder="e.g. Ama Serwaa"]', 'Esi Mensah');
    await page.fill('input[placeholder*="0244 123 456"]', '0200999888');
    await page.fill('textarea[placeholder*="How can we assist"]', 'Would love to invite the candidate to speak at our department association meeting.');

    // Submit message
    await page.getByRole('button', { name: 'Send Message' }).click();
    await expect(page.getByText('Message Successfully Delivered')).toBeVisible();
  });

});
