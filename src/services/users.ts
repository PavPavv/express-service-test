import { createUser, findUser, getAllUsers } from "../data-access/users.js";
import type { AuthResponse, LoginInput, User } from "../shared/types/index.js";
import type { CreateUserInput } from "../shared/types/user.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../shared/utils/auth.js";

export const getUsersService = async (): Promise<User[]> => {
  const users = await getAllUsers();
  if (users) {
    return users;
  }
  return [];
};

export const createUserService = async (
  data: CreateUserInput,
): Promise<AuthResponse | null> => {
  const existingUser = await findUser(data.email);

  if (existingUser) return null;

  const hashedPassword = await hashPassword(data.password);

  const newUser = await createUser({
    ...data,
    password: hashedPassword,
  });

  if (newUser) {
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return { user: newUser, token };
  }

  return null;
};

export const loginUserService = async (data: LoginInput) => {
  const user = await findUser(data.email);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // TODO
  // if (user.status) {}

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
