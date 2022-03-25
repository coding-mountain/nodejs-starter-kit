import { Request, Response, NextFunction } from 'express';
import Validator from '@app/libs/validator';
import { BadRequestException } from '@app/exceptions';
import UserService from '@app/services/user';
import { sanitize, SanitizeType } from '@app/libs/sanitize';

function validateUpdateForgotPasswordRequest(req: Request) {
  const validator = new Validator(
    req.body,
    {
      email: 'required|email',
      token: 'required',
      password: 'required',
    },
    ['email', 'token', 'password']
  );
  if (validator.isFailed()) {
    throw new BadRequestException(validator.firstError());
  }
  return {
    email: sanitize(req.body.email, [SanitizeType.lowerCase, SanitizeType.trim]),
    token: sanitize(req.body.token, [SanitizeType.trim]),
    password: sanitize(req.body.password, [SanitizeType.rtrim]),
  };
}

export async function updateForgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, token } = validateUpdateForgotPasswordRequest(req);
    await UserService.updateForgotPassword(email, token, password);
    res.json({
      status: 'ok',
    });
  } catch (e) {
    next(e);
  }
}
