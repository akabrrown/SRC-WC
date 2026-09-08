import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const testimonialSchema = z.object({
  name: z.string().min(2),
  programme_role: z.string().min(2),
  statement: z.string().min(10),
  photo_url: z.string().optional(),
  video_url: z.string().optional(),
  consent_confirmed: z.boolean(),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'archived']).default('draft')
});

// Public: Get published testimonials (only consent_confirmed = true)
router.get('/', (req: Request, res: Response) => {
  res.json(db.getTestimonials(true));
});

// Admin: Get all testimonials (requires manage_identity scope)
router.get(
  '/admin/all',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getTestimonials(false));
  }
);

// Admin: Create testimonial
router.post(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  logAdminAction('CREATE_TESTIMONIAL', 'Testimonial'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = testimonialSchema.parse(req.body);
    const created = db.addTestimonial(validated);
    res.status(201).json(created);
  }
);

// Admin: Update testimonial
router.put(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  logAdminAction('UPDATE_TESTIMONIAL', 'Testimonial'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = testimonialSchema.partial().parse(req.body);
    const id = getParam(req);
    const updated = db.updateTestimonial(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Testimonial not found.' });
    }
    res.json(updated);
  }
);

// Admin: Delete testimonial
router.delete(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  logAdminAction('DELETE_TESTIMONIAL', 'Testimonial'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const success = db.deleteTestimonial(id);
    if (!success) {
      return res.status(404).json({ title: 'Not Found', detail: 'Testimonial not found.' });
    }
    res.json({ message: 'Testimonial removed successfully.' });
  }
);

export default router;
