import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { db } from '../db/database.js';

export function logAdminAction(action: string, entity: string, getEntityId?: (req: AuthenticatedRequest) => string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Intercept finish to record log when successful
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.admin) {
        const entityId = getEntityId ? getEntityId(req) : (typeof req.params.id === 'string' ? req.params.id : (Array.isArray(req.params.id) ? req.params.id[0] : 'primary'));
        db.addAuditLog({
          admin_user_id: req.admin.id,
          admin_name: req.admin.name,
          action,
          entity,
          entity_id: entityId,
          details: `${action} executed on ${entity} (${entityId})`
        });
      }
    });
    next();
  };
}
