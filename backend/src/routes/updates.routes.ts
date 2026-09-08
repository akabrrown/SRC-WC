import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const updateSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  category: z.enum(['news', 'engagement', 'policy_update', 'speech', 'media_feature', 'milestone']),
  excerpt: z.string().min(5),
  body: z.string().min(10),
  cover_image_url: z.string().optional(),
  author_id: z.string().optional(),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'archived']).default('draft'),
  published_at: z.string().optional()
});

// Public: Get published updates
router.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string;
  const status = (req.query.status as string) || 'published';
  res.json(db.getUpdates(status, category));
});

// Public: Get update by slug
router.get('/slug/:slug', (req: Request, res: Response) => {
  const slug = getParam(req, 'slug');
  const item = db.getUpdateBySlug(slug);
  if (!item) {
    return res.status(404).json({ title: 'Not Found', detail: 'Update not found.' });
  }
  res.json(item);
});

// Public: Get update by ID
router.get('/:id', (req: Request, res: Response) => {
  const id = getParam(req);
  const item = db.getUpdateById(id) || db.getUpdateBySlug(id);
  if (!item) {
    return res.status(404).json({ title: 'Not Found', detail: 'Update not found.' });
  }
  res.json(item);
});

// Admin: Get all updates (including drafts, in_review, etc.)
router.get('/admin/all', authenticateAdmin, requirePermissionScope('manage_updates'), (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string;
  const category = req.query.category as string;
  res.json(db.getUpdates(status, category));
});

// Admin: Create new update
router.post(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_updates'),
  logAdminAction('CREATE_CAMPAIGN_UPDATE', 'CampaignUpdate'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = updateSchema.parse(req.body);
    if (validated.status === 'published' && !validated.published_at) {
      validated.published_at = new Date().toISOString();
    }
    const created = db.addUpdate(validated);
    res.status(201).json(created);
  }
);

// Admin: Update update
router.put(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_updates'),
  logAdminAction('UPDATE_CAMPAIGN_UPDATE', 'CampaignUpdate'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = updateSchema.partial().parse(req.body);
    if (validated.status === 'published' && !validated.published_at) {
      validated.published_at = new Date().toISOString();
    }
    const id = getParam(req);
    const updated = db.updateUpdate(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Update not found.' });
    }
    res.json(updated);
  }
);

// Admin: Delete update
router.delete(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_updates'),
  logAdminAction('DELETE_CAMPAIGN_UPDATE', 'CampaignUpdate'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const success = db.deleteUpdate(id);
    if (!success) {
      return res.status(404).json({ title: 'Not Found', detail: 'Update not found.' });
    }
    res.json({ message: 'Update deleted successfully.' });
  }
);

export default router;
