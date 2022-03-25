import { Response, Request, NextFunction } from 'express';
import UserService from '@app/services/user';
import { ValidationException } from '@app/exceptions';
import Validator from '@app/libs/validator';
import EmailService from '@app/libs/email';
import { UserStatus } from '@app/models/user/types';

export async function generateEmailVerificationToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const validator = new Validator(req.body, { email: 'required|email' });

    if (validator.isFailed()) {
      throw new ValidationException(validator.firstError());
    }

    const user = await UserService.findByEmail(email);

    if (!user || user.status === UserStatus.BANNED || user.status === UserStatus.DELETED) {
      throw new ValidationException('Invalid request');
    }

    if (user.status === UserStatus.ACTIVE) {
      throw new ValidationException('Email already Verified');
    }

    const token = await UserService.generateVerifyToken(email);
    await EmailService.sendVerificationEmail(user.email, user.name, token);

    res.json({
      status: 'ok',
    });
  } catch (e: any) {
    next(e);
  }
}
