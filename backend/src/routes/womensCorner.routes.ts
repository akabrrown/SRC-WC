import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const sectionSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(5),
  icon: z.string().min(2),
  sort_order: z.number().int().default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published')
});

// Public: Get published sections (only authenticated staff with manage_identity can see drafts)
router.get('/', (req: Request, res: Response) => {
  let onlyPublished = true;
  if (req.query.all === 'true') {
    const adminId = (req.headers['x-admin-id'] as string) || '';
    const admin = adminId ? db.getAdminUserById(adminId) : null;
    if (admin && admin.permission_scope.includes('manage_identity')) {
      onlyPublished = false;
    }
  }
  res.json(db.getWomensCornerSections(onlyPublished));
});

// Admin: Update section
router.put(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  logAdminAction('UPDATE_WOMENS_CORNER', 'WomensCornerSection'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = sectionSchema.partial().parse(req.body);
    const id = getParam(req);
    const updated = db.updateWomensCornerSection(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Section not found.' });
    }
    res.json(updated);
  }
);

export default router;
