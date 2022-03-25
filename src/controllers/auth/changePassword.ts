import { Request, Response, NextFunction } from 'express';
import Validator from '@app/libs/validator';
import { ValidationException } from '@app/exceptions';
import UserService from '@app/services/user';
import { sanitize, SanitizeType } from '@app/libs/sanitize';

function validateChangePasswordRequest(req: Request) {
  const validator = new Validator(
    req.body,
    {
      oldPassword: 'required',
      newPassword: 'required',
    },
    ['oldPassword', 'newPassword']
  );
  if (validator.isFailed()) {
    throw new ValidationException(validator.firstError());
  }
  return {
    oldPassword: sanitize(req.body.oldPassword, [SanitizeType.rtrim]),
    newPassword: sanitize(req.body.newPassword, [SanitizeType.rtrim]),
  };
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { newPassword, oldPassword } = validateChangePasswordRequest(req);
    const {
      user: { id: userId },
    } = req;
    await UserService.changePassword(userId, oldPassword, newPassword);
    res.json({
      status: 'ok',
    });
  } catch (e) {
    next(e);
  }
}
