import { Response, Request, NextFunction } from 'express';
import UserService from '@app/services/user';
import { ValidationException } from '@app/exceptions';
import Validator from '@app/libs/validator';

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, token } = req.body;

    const validator = new Validator(
      req.body,
      {
        email: 'required|email|max:255',
        token: 'required',
      },
      ['email', 'token']
    );

    if (validator.isFailed()) {
      throw new ValidationException(validator.firstError());
    }

    const data = await UserService.verifyEmail(email, token);
    res.json({ data, status: 'ok' });
  } catch (e: any) {
    next(e);
  }
};
