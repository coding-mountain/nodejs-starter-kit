import { NextFunction, Request, Response } from 'express';
import LOG from '@app/bootstrap/logger';
import Jwt, { JwtData } from '@app/libs/jwt';
import { BadRequestException, UnauthorizedException } from '@app/exceptions';
import UserService from '@app/services/user';
import { UserStatus } from '@app/models/user/types';
import { JWT_VERSION } from '@app/config';

export const JWT = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | string[] = String(
    req.headers['x-access-token'] || req.headers.authorization || req.headers.token || ''
  );

  if (!token) {
    throw new BadRequestException('Token not found');
  }

  token = token.replace('Bearer ', '');

  try {
    const tokenData = Jwt.verify(token) as JwtData;
    if (tokenData.version !== JWT_VERSION) {
      throw new Error('Invalid Version');
    }

    if (!tokenData) {
      throw new BadRequestException('Invalid token');
    }

    const user = await UserService.findByUid(tokenData.uid);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User not found.');
    }

    if (tokenData.authToken !== user.authToken) {
      throw new BadRequestException('Invalid Auth Token');
    }

    req.token = tokenData;
    req.user = user;
    next();
  } catch (error: any) {
    LOG.error(`JWT errror ${error.message}`);
    next(new UnauthorizedException('Invalid token'));
  }
};
