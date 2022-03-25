import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../config/constant';
import { ForbiddenException } from '../../exceptions';

export function admin(req: Request, res: Response, next: NextFunction) {
  if (req.user.role === UserRole.ADMIN) {
    return next();
  }
  throw new ForbiddenException();
}

export function user(req: Request, res: Response, next: NextFunction) {
  if (req.user.role === UserRole.USER) {
    return next();
  }
  throw new ForbiddenException();
}
