import { Request, Response, NextFunction } from 'express';
import Validator from '@app/libs/validator';
import { ValidationException } from '@app/exceptions';
import UserService from '@app/services/user';
import { sanitize, SanitizeType } from '@app/libs/sanitize';
import { UserRole } from '@app/config/constant';

function validateForgotPasswordRequest(req: Request) {
  const validator = new Validator(
    req.body,
    {
      email: 'required|email',
      role: `required|anyOne:${Object.keys(UserRole).join(',')}`,
    },
    ['email', 'role']
  );
  if (validator.isFailed()) {
    throw new ValidationException(validator.firstError());
  }
  return {
    email: sanitize(req.body.email, [SanitizeType.trim, SanitizeType.lowerCase]),
    role: sanitize<UserRole>(req.body.role, [SanitizeType.trim, SanitizeType.uppercase]),
  };
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, role } = validateForgotPasswordRequest(req);
    await UserService.forgotPassword(email, role);
    res.json({
      status: 'ok',
    });
  } catch (e) {
    next(e);
  }
}
