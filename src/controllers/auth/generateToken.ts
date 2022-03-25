import { Request, Response, NextFunction } from 'express';
import Validator from '@app/libs/validator';
import { ValidationException } from '@app/exceptions';
import UserService from '@app/services/user';
import { sanitize, SanitizeType } from '@app/libs/sanitize';

function validateGenerateTokenRequest(req: Request) {
  const validator = new Validator(
    req.body,
    {
      refreshToken: 'required',
      email: 'required|email',
    },
    ['email', 'refreshToken']
  );
  if (validator.isFailed()) {
    throw new ValidationException(validator.firstError());
  }
  return {
    email: sanitize(req.body.email, [SanitizeType.trim, SanitizeType.lowerCase]),
    refreshToken: sanitize(req.body.refreshToken, [SanitizeType.trim]),
  };
}

export async function generateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, refreshToken } = validateGenerateTokenRequest(req);
    const data = await UserService.refreshJwtToken(email, refreshToken);
    res.json({
      data,
      status: 'ok',
    });
  } catch (e) {
    next(e);
  }
}
