import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';
import { PermissionScope } from '../types/index.js';

const router = Router();

const PERMISSION_SCOPES: [PermissionScope, ...PermissionScope[]] = [
  'manage_settings',
  'manage_identity',
  'manage_policy',
  'manage_updates',
  'manage_media',
  'manage_events',
  'manage_voice',
  'manage_volunteers',
  'manage_users',
  'publish'
];

const adminUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role_label: z.string().min(2),
  permission_scope: z.array(z.enum(PERMISSION_SCOPES)).min(1)
});

// Admin: Get all admin users
router.get(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_users'),
  (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getAdminUsers());
  }
);

// Admin: Invite/create admin user
router.post(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_users'),
  logAdminAction('CREATE_ADMIN_USER', 'AdminUser'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = adminUserSchema.parse(req.body);
    const created = db.addAdminUser(validated);
    res.status(201).json(created);
  }
);

// Admin: Update user permissions/role
router.put(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_users'),
  logAdminAction('UPDATE_ADMIN_USER', 'AdminUser'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = adminUserSchema.partial().parse(req.body);
    const id = getParam(req);
    const updated = db.updateAdminUser(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Admin user not found.' });
    }
    res.json(updated);
  }
);

export default router;
