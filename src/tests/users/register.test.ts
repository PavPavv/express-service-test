import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

import { createServer } from '../../app.js';
import { StatusCodesEnum } from '../../shared/consts/status-codes.js';
import { prisma } from '../../config/db.js';

let app: Express;
const MOCK_EMAIL = 'test@example.com';

beforeAll(() => {
  app = createServer();
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: MOCK_EMAIL, }});
  await prisma.$disconnect();
});

describe('POST /api/users/register', () => {
  it('should register a new user and return token', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: '123456',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01T00:00:00Z'
      });

    expect(res.status).toBe(StatusCodesEnum.SuccessfullyCreated);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(MOCK_EMAIL);
    expect(res.body.user).not.toHaveProperty('password');
  });
});

