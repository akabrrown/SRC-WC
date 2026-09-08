import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const windowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 10; // Max 10 submissions per minute per IP
const ipStore = new Map<string, RateLimitRecord>();

export function publicSubmissionRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = ipStore.get(ip);

  if (!record || now > record.resetTime) {
    ipStore.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return next();
  }

  if (record.count >= maxRequestsPerWindow) {
    return res.status(429).json({
      type: 'https://api.upsa-src-wc.org/errors/rate-limit-exceeded',
      title: 'Too Many Requests',
      status: 429,
      detail: 'Submission rate limit exceeded. Please wait a minute before submitting again.'
    });
  }

  record.count += 1;
  next();
}
