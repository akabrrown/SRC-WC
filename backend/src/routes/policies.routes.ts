import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const policySchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(5),
  issue_statement: z.string().min(10),
  solution: z.string().min(10),
  why_it_matters: z.string().min(10),
  implementation_plan: z.string().optional(),
  timeline: z.string().optional(),
  partners: z.string().optional(),
  cost_notes: z.string().optional(),
  beneficiaries: z.string().optional(),
  success_indicators: z.string().optional(),
  video_url: z.string().optional(),
  document_url: z.string().optional(),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'archived']).default('published')
});

// Public: Get policy items (empty if in teaser mode!)
router.get('/', (req: Request, res: Response) => {
  const settings = db.getSiteSettings();
  if (settings.agenda_teaser_mode) {
    return res.json({
      teaser_mode: true,
      teaser_copy: 'Our full policy agenda is currently in development, being shaped directly by student survey feedback. Reveal coming soon.',
      teaser_video_url: settings.teaser_video_url || '',
      policies: []
    });
  }

  const policies = db.getPolicies(true);
  res.json({
    teaser_mode: false,
    policies
  });
});

// Admin: Get all policy items (requires manage_policy scope)
router.get(
  '/admin/all',
  authenticateAdmin,
  requirePermissionScope('manage_policy'),
  (req: AuthenticatedRequest, res: Response) => {
    const isTeaser = db.getSiteSettings().agenda_teaser_mode;
    res.json({
      isTeaserMode: isTeaser,
      policies: db.getPolicies(false)
    });
  }
);

// Admin: Create policy item (blocked if teaser mode is on)
router.post(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_policy'),
  logAdminAction('CREATE_POLICY_ITEM', 'PolicyItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = policySchema.parse(req.body);
    const created = db.addPolicyItem(validated);
    res.status(201).json(created);
  }
);

// Admin: Update policy item
router.put(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_policy'),
  logAdminAction('UPDATE_POLICY_ITEM', 'PolicyItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = policySchema.partial().parse(req.body);
    const id = getParam(req);
    const updated = db.updatePolicyItem(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Policy item not found.' });
    }
    res.json(updated);
  }
);

// Admin: Delete policy item
router.delete(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_policy'),
  logAdminAction('DELETE_POLICY_ITEM', 'PolicyItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const success = db.deletePolicyItem(id);
    if (!success) {
      return res.status(404).json({ title: 'Not Found', detail: 'Policy item not found.' });
    }
    res.json({ message: 'Policy item deleted successfully.' });
  }
);

export default router;
