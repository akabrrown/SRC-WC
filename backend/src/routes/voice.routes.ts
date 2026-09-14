import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { publicSubmissionRateLimiter } from '../middlewares/rateLimiter.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const voiceSubmissionSchema = z.object({
  type: z.enum(['concern', 'idea']),
  name: z.string().optional(),
  programme: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters long')
});

const surveyLinkSchema = z.object({
  form_name: z.string().min(3),
  platform: z.string().min(2),
  url: z.string().url().or(z.literal('')),
  status: z.enum(['live', 'coming_soon']),
  description: z.string().optional(),
  sort_order: z.number().int().default(0)
});

// Public: Get survey links
router.get('/surveys', (req: Request, res: Response) => {
  res.json(db.getSurveyLinks());
});

// Admin: Add survey link
router.post(
  '/surveys',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('CREATE_SURVEY_LINK', 'SurveyLink'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = surveyLinkSchema.parse(req.body);
    const created = db.addSurveyLink(validated);
    res.status(201).json(created);
  }
);

// Admin: Update survey link
router.put(
  '/surveys/:id',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('UPDATE_SURVEY_LINK', 'SurveyLink'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = surveyLinkSchema.partial().parse(req.body);
    const id = getParam(req);
    const updated = db.updateSurveyLink(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Survey link not found.' });
    }
    res.json(updated);
  }
);

// Admin: Delete survey link
router.delete(
  '/surveys/:id',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('DELETE_SURVEY_LINK', 'SurveyLink'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const success = db.deleteSurveyLink(id);
    if (!success) {
      return res.status(404).json({ title: 'Not Found', detail: 'Survey link not found.' });
    }
    res.json({ message: 'Survey link deleted successfully.' });
  }
);

// Public: Submit student voice (concern or idea)
router.post(
  '/submissions',
  publicSubmissionRateLimiter,
  (req: Request, res: Response) => {
    const validated = voiceSubmissionSchema.parse(req.body);
    const created = db.addStudentVoiceSubmission(validated);
    res.status(201).json({
      message: 'Thank you. Your voice has been submitted to the campaign policy desk.',
      submissionId: created.id
    });
  }
);

// Admin: Get student voice submissions
router.get(
  '/submissions',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  (req: AuthenticatedRequest, res: Response) => {
    const status = req.query.status as string;
    res.json(db.getStudentVoiceSubmissions(status));
  }
);
router.get(
  '/admin/submissions',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  (req: AuthenticatedRequest, res: Response) => {
    const status = req.query.status as string;
    res.json(db.getStudentVoiceSubmissions(status));
  }
);

// Admin: Update student voice submission status
router.put(
  '/submissions/:id/status',
  authenticateAdmin,
  requirePermissionScope('manage_voice'),
  logAdminAction('UPDATE_VOICE_STATUS', 'StudentVoiceSubmission'),
  (req: AuthenticatedRequest, res: Response) => {
    const status = req.body.status;
    const id = getParam(req);
    const updated = db.updateStudentVoiceStatus(id, status);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Submission not found.' });
    }
    res.json(updated);
  }
);

export default router;
