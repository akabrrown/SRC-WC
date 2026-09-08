import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import identityRoutes from './routes/identity.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import updatesRoutes from './routes/updates.routes.js';
import eventsRoutes from './routes/events.routes.js';
import womensCornerRoutes from './routes/womensCorner.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import volunteersRoutes from './routes/volunteers.routes.js';
import testimonialsRoutes from './routes/testimonials.routes.js';
import faqRoutes from './routes/faq.routes.js';
import mediaRoutes from './routes/media.routes.js';
import contactRoutes from './routes/contact.routes.js';
import policiesRoutes from './routes/policies.routes.js';
import usersRoutes from './routes/users.routes.js';
import auditRoutes from './routes/audit.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Security & Parsers
app.disable('x-powered-by');

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (requestOrigin, callback) => {
    // Allow non-browser requests or allowed frontend origins
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-id']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: "SRC Women's Commissioner API",
    time: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/identity', identityRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/womens-corner', womensCornerRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/policies', policiesRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/audit-logs', auditRoutes);

// Structured Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SRC-WC API] Server listening on http://127.0.0.1:${PORT}`);
  });
}

export default app;
