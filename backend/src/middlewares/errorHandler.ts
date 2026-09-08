import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    const issues = err.issues || (err as any).errors || [];
    return res.status(400).json({
      type: 'https://api.upsa-src-wc.org/errors/validation-failed',
      title: 'Validation Failed',
      status: 400,
      detail: 'The submitted data failed field schema validation.',
      errors: issues.map((e: any) => ({
        field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
        message: e.message
      }))
    });
  }

  if (err.message && err.message.includes('blocked')) {
    return res.status(422).json({
      type: 'https://api.upsa-src-wc.org/errors/business-rule-violation',
      title: 'Unprocessable Entity',
      status: 422,
      detail: err.message
    });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({
    type: 'https://api.upsa-src-wc.org/errors/internal-server-error',
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred while processing the request.'
  });
}
