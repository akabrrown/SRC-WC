import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authenticateAdmin, requirePermissionScope, AuthenticatedRequest } from '../middlewares/auth.js';
import { logAdminAction } from '../middlewares/auditLogger.js';
import { getParam } from '../utils/params.js';

const router = Router();

const eventSchema = z.object({
  name: z.string().min(3),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  event_time: z.string().min(2),
  venue: z.string().min(2),
  description: z.string().min(5),
  registration_link: z.string().optional(),
  status: z.enum(['draft', 'in_review', 'approved', 'published', 'archived']).default('published')
});

// Public: Get events (upcoming vs past)
router.get('/', (req: Request, res: Response) => {
  const allEvents = db.getEvents('published');
  const now = new Date().toISOString().split('T')[0];
  const type = req.query.type as string; // 'upcoming' | 'past'

  if (type === 'upcoming') {
    return res.json(allEvents.filter(e => e.event_date >= now));
  }
  if (type === 'past') {
    return res.json(allEvents.filter(e => e.event_date < now));
  }

  res.json(allEvents);
});

// Admin: Get all events
router.get('/admin/all', authenticateAdmin, requirePermissionScope('manage_events'), (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string;
  res.json(db.getEvents(status));
});

// Admin: Create event
router.post(
  '/',
  authenticateAdmin,
  requirePermissionScope('manage_events'),
  logAdminAction('CREATE_EVENT', 'Event'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = eventSchema.parse(req.body);
    const created = db.addEvent(validated);
    res.status(201).json(created);
  }
);

// Admin: Update event
router.put(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_events'),
  logAdminAction('UPDATE_EVENT', 'Event'),
  (req: AuthenticatedRequest, res: Response) => {
    const validated = eventSchema.partial().parse(req.body);
    const id = getParam(req);
    const updated = db.updateEvent(id, validated);
    if (!updated) {
      return res.status(404).json({ title: 'Not Found', detail: 'Event not found.' });
    }
    res.json(updated);
  }
);

// Admin: Delete event
router.delete(
  '/:id',
  authenticateAdmin,
  requirePermissionScope('manage_events'),
  logAdminAction('DELETE_EVENT', 'Event'),
  (req: AuthenticatedRequest, res: Response) => {
    const id = getParam(req);
    const success = db.deleteEvent(id);
    if (!success) {
      return res.status(404).json({ title: 'Not Found', detail: 'Event not found.' });
    }
    res.json({ message: 'Event deleted successfully.' });
  }
);

export default router;
