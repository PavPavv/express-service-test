import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { SALT_ROUNDS } from '../consts/index.js';
import type { TokenPayload } from '../types/index.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../consts/index.js';

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