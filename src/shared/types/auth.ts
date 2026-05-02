import type { User } from "./user.js";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult extends Omit<User, "password"> {}

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export interface AuthResponse {
  user: AuthResult,
  token: string;
}
