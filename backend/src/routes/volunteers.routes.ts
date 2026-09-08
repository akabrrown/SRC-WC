import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { publicSubmissionRateLimiter } from '../middlewares/rateLimiter.js';
import { logAdminAction } from '../middlewares/auditLogger.js';

const router = Router();

const volunteerSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  programme: z.string().min(2, 'Programme is required'),
  level: z.string().min(1, 'Level is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
  area_of_interest: z.string().min(2, 'Area of interest is required'),
  skills: z.string().optional(),
  availability: z.string().min(2, 'Availability is required'),
  motivation: z.string().optional(),
  registration_type: z.enum(['volunteer', 'campaign_team', 'ambassador', 'supporter'])
});

// Public: Submit volunteer registration
router.post('/', publicSubmissionRateLimiter, (req: Request, res: Response) => {
  const validated = volunteerSchema.parse(req.body);
  const created = db.addVolunteerRegistration(validated);
  res.status(201).json({
    message: 'Registration received. Our mobilisation coordinator will reach out to you shortly.',
    registrationId: created.id
  });
});

// Admin: Get volunteer registrations
router.get(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_volunteers'),
  (req: AuthenticatedRequest, res: Response) => {
    const type = req.query.type as string;
    res.json(db.getVolunteerRegistrations(type));
  }
);

// Admin: Export registrations to CSV
router.get(
  '/export',
  authenticateAdmin,
  requirePermissionScope('manage_volunteers'),
  logAdminAction('EXPORT_VOLUNTEERS_CSV', 'VolunteerRegistrations'),
  (req: AuthenticatedRequest, res: Response) => {
    const type = req.query.type as string;
    const records = db.getVolunteerRegistrations(type);

    const headers = [
      'ID',
      'Full Name',
      'Programme',
      'Level',
      'Phone',
      'Email',
      'Area of Interest',
      'Skills',
      'Availability',
      'Motivation',
      'Registration Type',
      'Date Submitted'
    ];

    const escapeCsv = (str?: string) => `"${(str || '').replace(/"/g, '""')}"`;

    const rows = records.map(r => [
      escapeCsv(r.id),
      escapeCsv(r.full_name),
      escapeCsv(r.programme),
      escapeCsv(r.level),
      escapeCsv(r.phone),
      escapeCsv(r.email),
      escapeCsv(r.area_of_interest),
      escapeCsv(r.skills),
      escapeCsv(r.availability),
      escapeCsv(r.motivation),
      escapeCsv(r.registration_type),
      escapeCsv(r.created_at)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="src_wc_volunteers_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  }
);

export default router;
