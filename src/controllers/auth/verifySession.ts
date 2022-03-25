import { Request, Response, NextFunction } from 'express';

export function verifySession(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      status: 'ok',
    });
  } catch (e) {
    next(e);
  }
}
