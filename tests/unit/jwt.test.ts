import 'dotenv/config';
import { expect } from 'chai';
import { uniqueId } from '@app/utils';
import { JsonWebTokenError } from 'jsonwebtoken';
import JWT from '@app/libs/jwt';

// verify payload
let token: string = '';
let refreshToken: string = '';
const uid: string = uniqueId();

describe('JWT', () => {
  it('should generate payload', () => {
    token = JWT.generate(uid, uniqueId());
    expect(token).to.be.a('string');
  });

  it('should generate payload for refresh token', () => {
    refreshToken = JWT.generate(uid, uniqueId(), true);
    expect(refreshToken).to.be.a('string');
  });

  it('should token return invalid signature', () => {
    try {
      JWT.verify(token + 1);
      throw new Error('should not reach this point');
    } catch (err) {
      expect(err).to.be.an.instanceof(JsonWebTokenError);
    }
  });

  it('should token return all valid keys', () => {
    expect(JWT.verify(token)).to.have.all.keys('uid', 'createdAt', 'version', 'authToken', 'iat', 'exp');
  });

  it('Refresh token => should token return all valid keys', () => {
    expect(JWT.verify(refreshToken, true)).to.have.all.keys('uid', 'createdAt', 'version', 'authToken', 'iat', 'exp');
  });

  it('should token return valid uid', () => {
    expect(JWT.verify(token)).to.include({ uid });
  });

  it('should payload have valid uid', () => {
    // @ts-ignore
    expect(JWT.getPayload(uid)).to.include({ uid, version: JWT.version });
  });
});
