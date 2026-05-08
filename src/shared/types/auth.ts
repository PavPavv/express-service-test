import type { JwtPayload } from 'jsonwebtoken';
import type { Role, User } from "./user.js";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult extends Omit<User, "password"> { }

export interface TokenPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: AuthResult;
  token: string;
}

export type DecodedToken =  TokenPayload & JwtPayload;

export const isDecodedToken = (value: string | JwtPayload | null): value is DecodedToken => {
  if (!value ||  typeof value === 'string') return false;
  
  if ('role' in value && 'userId' in value) {
    return true;
  }

  return false;
}