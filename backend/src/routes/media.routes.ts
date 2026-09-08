import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const mediaSchema = z.object({
  media_type: z.enum(['photo', 'video']),
  url: z.string().min(3),
  caption: z.string().optional(),
  alt_text: z.string().min(3, 'Alt text is mandatory for accessibility'),
  event_id: z.string().optional(),
  sort_order: z.number().int().default(0)
});

// Public: Get gallery items
router.get('/', (req: Request, res: Response) => {
  res.json(db.getMediaGallery());
});

// Admin: Add media item
router.post(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_media'),
  logAdminAction('UPLOAD_MEDIA', 'MediaItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = mediaSchema.parse(req.body);
    const created = db.addMediaItem(validated);
    res.status(201).json(created);
  }
);

// Admin: Delete media item
router.delete(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_media'),
  logAdminAction('DELETE_MEDIA', 'MediaItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const success = db.deleteMediaItem(id);
    if (!success) {
      return res.status(404).json({ title: 'Not Found', detail: 'Media item not found.' });
    }
    res.json({ message: 'Media item deleted successfully.' });
  }
);

export default router;
