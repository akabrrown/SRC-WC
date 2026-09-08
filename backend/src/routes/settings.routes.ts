import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';

const router = Router();

// Public: Get site settings
router.get('/', (req: Request, res: Response) => {
  res.json(db.getSiteSettings());
});

// Admin: Update launch settings (Teaser mode toggle, election date, etc.)
router.put(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_settings'),
  logAdminAction('UPDATE_SITE_SETTINGS', 'SiteSettings'),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateSiteSettings(req.body);
    res.json(updated);
  }
);

// Admin: Quick toggle launch phase
router.post(
  '/toggle-phase',
  authenticateAdmin,
  requirePermissionScope('manage_settings'),
  logAdminAction('TOGGLE_LAUNCH_PHASE', 'SiteSettings'),
  (req: AuthenticatedRequest, res: Response) => {
    const current = db.getSiteSettings();
    const updated = db.updateSiteSettings({
      agenda_teaser_mode: !current.agenda_teaser_mode
    });
    res.json({
      message: `Agenda phase switched to: ${updated.agenda_teaser_mode ? 'Teaser Mode' : 'Policy Reveal'}`,
      settings: updated
    });
  }
);

export default router;
