import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { publicSubmissionRateLimiter } from '../middlewares/rateLimiter.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  programme: z.string().min(2, 'Programme is required'),
  contact: z.string().min(5, 'Contact details are required'),
  enquiry_category: z.enum([
    'General Campaign Enquiry',
    'Policy & Welfare Suggestion',
    'Media / Press Interview',
    'Volunteer / Campus Team',
    'Hostel Welfare Urgent'
  ]),
  message: z.string().min(5, 'Message must be at least 5 characters')
});

// Public: Submit contact form
router.post('/', publicSubmissionRateLimiter, (req: Request, res: Response) => {
  const validated = contactSchema.parse(req.body);
  const created = db.addContactSubmission(validated);
  res.status(201).json({
    message: 'Message delivered to the campaign desk. We will respond promptly.',
    submissionId: created.id
  });
});

// Admin: Get contact submissions
router.get(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  (req: AuthenticatedRequest, res: Response) => {
    const status = req.query.status as string;
    res.json(db.getContactSubmissions(status));
  }
);

// Admin: Update contact submission status
router.put(
  '/:id/status',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('UPDATE_CONTACT_STATUS', 'ContactSubmission'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const status = req.body.status as any;
    const updated = db.updateContactSubmissionStatus(id, status);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Contact submission not found.' });
    }
    res.json(updated);
  }
);

export default router;
