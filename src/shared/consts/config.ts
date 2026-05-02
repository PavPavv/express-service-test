export const SALT_ROUNDS = 10;
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod'
export const JWT_EXPIRES_IN = '7d'