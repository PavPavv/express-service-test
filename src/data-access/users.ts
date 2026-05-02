import { prisma } from '../config/db.js';
import type { AuthResult, User, CreateUserInput } from '../shared/types/index.js';


export const getAllUsers = async (): Promise<User[] | void> => {
  try {
    await prisma.user.findMany({
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
    // TODO: добавить обработку ошибок на уровне сервиса
    global.console.error(err);
  }
};

export const createUser = async (data: CreateUserInput): Promise<AuthResult | void> => {
  try {
    await prisma.user.create({
      data,
      omit: {
        password: true,
      }
    });
  } catch (err) {
    // TODO: добавить обработку ошибок на уровне сервиса
    global.console.error(err);
  }
};

// TODO: поправить тип
export const findUser = async (email: string): Promise<any> => {
  try {
    await prisma.user.findUnique({
      where: { email }
    });
  } catch (err) {
    // TODO: добавить обработку ошибок на уровне сервиса
    global.console.error(err);
  }
};