import { Response, Request, NextFunction } from 'express';
import UserService from '@app/services/user';
import { ValidationException } from '@app/exceptions';
import Validator from '@app/libs/validator';
import { UserStatus } from '@app/models/user/types';
import { sanitize, SanitizeType } from '@app/libs/sanitize';
import { UserRole } from '@app/config/constant';

function validateLoginWithEmailRequest(req: Request) {
  const validator = new Validator(
    req.body,
    {
      email: 'required|email',
      password: 'required|max:250',
      role: `required|anyOne:${Object.keys(UserRole).join(',')}`,
    },
    ['email', 'password', 'role']
  );

  if (validator.isFailed()) {
    throw new ValidationException(validator.firstError());
  }
  return {
    email: sanitize(req.body.email, [SanitizeType.trim, SanitizeType.lowerCase]),
    password: sanitize(req.body.password, [SanitizeType.rtrim]),
    role: sanitize<UserRole>(req.body.role, [SanitizeType.trim, SanitizeType.uppercase]),
  };
}

export const loginWithEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = validateLoginWithEmailRequest(req);
    const user = await UserService.login(email, password, role);
    return res.json({
      data: user,
      status: 'ok',
    });
  } catch (e: any) {
    if (e instanceof ValidationException && e.message === 'USER_NOT_ACTIVE') {
      return res.status(200).json({
        data: {
          user: { status: UserStatus.INACTIVE },
        },
        status: 'ok',
      });
    }
    if (e instanceof ValidationException && e.message === 'VERIFICATION_EMAIL_SENT') {
      return res.status(200).json({
        data: {
          user: { status: UserStatus.INACTIVE },
          verificationEmailSent: true,
        },
        status: 'ok',
      });
    }
    return next(e);
  }
};
