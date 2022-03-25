// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';
import { JwtData } from '@app/libs/jwt';
import User from '@app/models/user';

declare global {
  namespace Express {
    export interface Request {
      token: JwtData;
      user: User;
    }
  }
}
