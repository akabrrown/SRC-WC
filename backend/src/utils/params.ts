import { Request } from 'express';

export function getParam(req: Request, key = 'id'): string {
  const val = req.params[key];
  if (Array.isArray(val)) {
    return val[0] || '';
  }
  return val || '';
}
