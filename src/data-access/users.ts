import { prisma } from "../config/db.js";
import { logger } from '../config/logger.js';
import type {
  AuthResult,
  User,
  CreateUserInput,
} from "../shared/types/index.js";

export const getAllUsers = async (): Promise<User[] | void> => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (err) {
    logger.error({ error: err }, 'Ошибка получения пользователей.');
  }
};

export const getUserById = async (id: number): Promise<any> => {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (err) {
    logger.error({ error: err }, 'Ошибка получения пользователя по ID.');
  }
}

export const createUser = async (
  data: CreateUserInput,
): Promise<AuthResult | void> => {
  try {
    return await prisma.user.create({
      data,
      omit: {
        password: true,
      },
    });
  } catch (err) {
    logger.error({ error: err }, 'Ошибка создания пользователя.');
  }
};

// TODO: поправить тип
export const findUser = async (email: string): Promise<any> => {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (err) {
    logger.error({ error: err }, 'Ошибка получения пользователя.');
  }
};

// TODO: поправить тип
export const deactivateUserById = async (id: number): Promise<any> => {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        'status': 'INACTIVE',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
    });
  } catch(err) {
    logger.error({ error: err }, 'Ошибка блокировки пользователя.');
  }
};
