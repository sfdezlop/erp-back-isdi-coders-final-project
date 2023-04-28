import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { HTTPError } from '../interfaces/error.js';
import createDebug from 'debug';
const debug = createDebug('ERP:services:auth');

debug('Loaded');

export interface PayloadToken extends jwt.JwtPayload {
  id: string;
  email: string;
}

const salt = 10;

export class Auth {
  static createJWT(payload: PayloadToken) {
    return jwt.sign(payload, config.JWT_SECRET as string, {
      expiresIn: 60 * 60 * 24,
    });
  }

  // Expiration in seconds

  static verifyJWTGettingPayload(token: string) {
    const result = jwt.verify(token, config.JWT_SECRET as string);
    if (typeof result === 'string')
      throw new HTTPError(498, 'Invalid payload', result);
    return result as unknown as PayloadToken;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
