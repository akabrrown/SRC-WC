import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';

const router = Router();

// Public: Get candidate profile
router.get('/candidate', (req: Request, res: Response) => {
  res.json(db.getCandidateProfile());
});

// Admin: Update candidate profile
router.put(
  '/candidate',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  logAdminAction('UPDATE_CANDIDATE_PROFILE', 'CandidateProfile'),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateCandidateProfile(req.body);
    res.json(updated);
  }
);

// Public: Get vision & values
router.get('/vision', (req: Request, res: Response) => {
  res.json(db.getVisionContent());
});

// Public: Get values
router.get('/values', (req: Request, res: Response) => {
  res.json(db.getValues());
});

// Public: Get promises
router.get('/promises', (req: Request, res: Response) => {
  res.json(db.getPromises());
});

// Admin: Update vision & mission
router.put(
  '/vision',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  logAdminAction('UPDATE_VISION_CONTENT', 'VisionContent'),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateVisionContent(req.body);
    res.json(updated);
  }
);

// Admin: Update values
router.put(
  '/values',
  authenticateAdmin,
  requirePermissionScope('manage_identity'),
  logAdminAction('UPDATE_CAMPAIGN_VALUES', 'CampaignValues'),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateValues(req.body.values || req.body);
    res.json(updated);
  }
);

// Public: Get brand assets
router.get('/brand', (req: Request, res: Response) => {
  res.json(db.getBrandAssets());
});
router.get('/brand-assets', (req: Request, res: Response) => {
  res.json(db.getBrandAssets());
});

// Admin: Update brand assets
router.put(
  '/brand',
  authenticateAdmin,
  requirePermissionScope('manage_settings'),
  logAdminAction('UPDATE_BRAND_ASSETS', 'BrandAssets'),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateBrandAssets(req.body);
    res.json(updated);
  }
);
router.put(
  '/brand-assets',
  authenticateAdmin,
  requirePermissionScope('manage_settings'),
  logAdminAction('UPDATE_BRAND_ASSETS', 'BrandAssets'),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateBrandAssets(req.body);
    res.json(updated);
  }
);

// Public: Get contact channels
router.get('/channels', (req: Request, res: Response) => {
  res.json(db.getContactChannels());
});
router.get('/contact-channels', (req: Request, res: Response) => {
  res.json(db.getContactChannels());
});

// Admin: Update contact channels
router.put(
  '/channels',
  authenticateAdmin,
  requirePermissionScope('manage_settings'),
  logAdminAction('UPDATE_CONTACT_CHANNELS', 'ContactChannels'),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateContactChannels(req.body);
    res.json(updated);
  }
);

// Public: Get social links
router.get('/social-links', (req: Request, res: Response) => {
  const onlyVisible = req.query.all !== 'true';
  res.json(db.getSocialLinks(onlyVisible));
});

export default router;
