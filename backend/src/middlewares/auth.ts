import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database.js';
import { PermissionScope, AdminUser } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  admin?: AdminUser;
}

export function authenticateAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check for admin ID in header (defaulting to primary admin in local mode)
  const adminId = (req.headers['x-admin-id'] as string) || 'adm-1';
  const admin = db.getAdminUserById(adminId);

  if (!admin) {
    return res.status(401).json({
      type: 'https://api.upsa-src-wc.org/errors/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Valid admin credentials are required.'
    });
  }

  req.admin = admin;
  next();
}

export function requirePermissionScope(scope: PermissionScope) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        type: 'https://api.upsa-src-wc.org/errors/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: 'Authentication is required before checking permissions.'
      });
    }

    if (!req.admin.permission_scope.includes(scope)) {
      return res.status(403).json({
        type: 'https://api.upsa-src-wc.org/errors/forbidden',
        title: 'Forbidden',
        status: 403,
        detail: `Missing required permission scope: ${scope}. Consult the governance lead.`
      });
    }

    next();
  };
}
