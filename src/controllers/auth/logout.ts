import { Request, Response, NextFunction } from 'express';
import UserService from '@app/services/user';

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      user: { id: userId },
    } = req;
    await UserService.logout(userId);
    res.json({
      status: 'ok',
    });
  } catch (e) {
    next(e);
  }
}
