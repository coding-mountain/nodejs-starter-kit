import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  JWT_VERSION,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_VERSION,
} from '@app/config';

export interface JwtData extends JwtPayload {
  authToken: string;
  createdAt: number;
  uid: string;
  version: number;
}

class Jwt {
  protected version: number;

  protected refreshVersion: number;

  protected secret: string;

  protected refreshSecret: string;

  constructor() {
    this.version = JWT_VERSION;
    this.secret = JWT_SECRET;
    this.refreshVersion = REFRESH_TOKEN_VERSION;
    this.refreshSecret = REFRESH_TOKEN_SECRET_KEY;
  }

  /**
   * Generate Payload
   *
   * @param   {string}   uid  [uid of user]
   *
   * @return  {JwtData}       [return jwt data ]
   */
  private getPayload(uid: string, authToken: string, isRefreshToken: boolean): JwtData {
    return {
      createdAt: Date.now(),
      uid,
      authToken,
      version: isRefreshToken ? this.refreshVersion : this.version,
    };
  }

  /**
   * Generate JWT Token
   *
   * @param   {string}  uid  [uid of user]
   *
   * @return  {string}       [return jwt token]
   *
   * @todo
   * login from multiple devices
   * expire individual user's login
   */
  public generate(uid: string, authToken: string, isRefreshToken: boolean = false): string {
    const tokenSecret = isRefreshToken ? this.refreshSecret : this.secret;
    const expiresIn = isRefreshToken ? REFRESH_TOKEN_EXPIRES_IN : JWT_EXPIRES_IN;
    return jwt.sign(this.getPayload(uid, authToken, isRefreshToken), tokenSecret, { algorithm: 'HS256', expiresIn });
  }

  /**
   * verify JWT Token
   *
   * @param   {string}  token  [token to verify]
   *
   * @return  {jwt data}       [return jwt data]
   */
  public verify(token: string, isRefreshToken: boolean = false) {
    const tokenSecret = isRefreshToken ? this.refreshSecret : this.secret;
    return jwt.verify(token, tokenSecret, { algorithms: ['HS256'] });
  }
}

export default new Jwt();
