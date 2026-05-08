import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { SALT_ROUNDS } from '../consts/index.js';
import type { TokenPayload } from '../types/index.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../consts/index.js';
import { isDecodedToken } from '../types/auth.js';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};


export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const parseToken = (token: string) => {
  return jwt.decode(token);
};

export const checkAccessByRoleAndId = (parsedToken: string | JwtPayload | null, id?: string): boolean => {
  global.console.log({ parsedToken });
  if (parsedToken && isDecodedToken(parsedToken)) {
    if (parsedToken.role === 'ADMIN' || parsedToken.userId === Number(id)) {
      return true 
    }
  }
  return false;
};

export const checkAccessByRole = (parsedToken: string | JwtPayload | null): boolean => {
  if (parsedToken && isDecodedToken(parsedToken)) {
    if (parsedToken.role === 'ADMIN') {
      return true 
    }
  }
  return false;
};