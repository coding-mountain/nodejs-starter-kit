import { Response, Request, NextFunction } from 'express';
import { UserRole } from '@app/config/constant';
import { UserFillable } from '@app/models/user/types';
import UserService from '@app/services/user';
import { ValidationException } from '@app/exceptions';
import Validator from '@app/libs/validator';
import { sanitize, SanitizeType } from '@app/libs/sanitize';

const validateSignUpRequest = async (req: Request) => {
  const knownFields = ['name', 'email', 'password', 'role'];

  const validatorOptions: { [key: string]: string } = {
    name: 'required|alphabetWithSpace|min:3|max:255',
    email: 'required|email|min:3|max:255',
    password: 'required|min:6|max:255',
    mobile: 'required|phone',
    role: `required|anyOne:${UserRole.USER},${UserRole.ADMIN}`,
  };

  const validator = new Validator(req.body, validatorOptions, knownFields);

  if (validator.isFailed()) {
    throw new ValidationException(validator.firstError());
  }

  const user = await UserService.findByEmail(req.body.email);

  if (user) {
    throw new ValidationException('Email already exists');
  }
  return {
    email: sanitize(req.body.email, [SanitizeType.trim, SanitizeType.lowerCase]),
    name: sanitize(req.body.name, [SanitizeType.trim]),
    role: sanitize<UserRole>(req.body.role, [SanitizeType.uppercase]),
    password: sanitize(req.body.password, [SanitizeType.rtrim]),
  };
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = await validateSignUpRequest(req);
    const data: UserFillable = {
      email,
      password,
      name,
      role,
    };
    await UserService.register(data);
    res.status(200).json({ status: 'ok' });
  } catch (e: any) {
    next(e);
  }
};
