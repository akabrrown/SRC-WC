import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';
import { FAQCategory } from '../types/index.js';

const router = Router();

const FAQ_CATEGORIES: [FAQCategory, ...FAQCategory[]] = [
  'About the Candidate',
  'Why She Is Contesting',
  "Role of the SRC Women's Commissioner",
  'Campaign Agenda',
  'How Policies Will Be Implemented',
  'How Students Can Participate',
  'How to Contact the Candidate'
];

const faqSchema = z.object({
  category: z.enum(FAQ_CATEGORIES),
  question: z.string().min(5),
  answer: z.string().min(5),
  sort_order: z.number().int().default(0),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'archived']).default('published')
});

// Public: Get published FAQ items grouped by category
router.get('/', (req: Request, res: Response) => {
  const items = db.getFAQItems(true);
  res.json(items);
});

// Admin: Get all FAQ items (requires manage_voice scope)
router.get(
  '/admin/all',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  (req: AuthenticatedRequest, res: Response) => {
    res.json(db.getFAQItems(false));
  }
);

// Admin: Create FAQ item
router.post(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('CREATE_FAQ_ITEM', 'FAQItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = faqSchema.parse(req.body);
    const created = db.addFAQItem(validated);
    res.status(201).json(created);
  }
);

// Admin: Update FAQ item
router.put(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('UPDATE_FAQ_ITEM', 'FAQItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = faqSchema.partial().parse(req.body);
    const id = getParam(req);
    const updated = db.updateFAQItem(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'FAQ item not found.' });
    }
    res.json(updated);
  }
);

// Admin: Delete FAQ item
router.delete(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('DELETE_FAQ_ITEM', 'FAQItem'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const success = db.deleteFAQItem(id);
    if (!success) {
      return res.status(404).json({ title: 'Not Found', detail: 'FAQ item not found.' });
    }
    res.json({ message: 'FAQ item deleted successfully.' });
  }
);

export default router;
