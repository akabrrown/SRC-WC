import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// Admin: Read-only audit log feed protected by manage_settings scope
router.get(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_settings'),
  (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getAuditLogs());
  }
);

export default router;

