import type { Request, Response, NextFunction } from "express";
import {
  createUserService,
  getUsersService,
  loginUserService,
} from "../services/users.js";
import { StatusCodesEnum } from "../shared/consts/index.js";
import { loginSchema } from "../shared/validators/user.validator.js";
import type { LoginInput } from "../shared/types/auth.js";

export const getUsers = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const users = await getUsersService();

  res.status(StatusCodesEnum.OK).json(users);
};

export const postUser = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const data = req.body;
  const newUser = await createUserService(data);

  res.status(StatusCodesEnum.SuccessfullyCreated).json(newUser);
};

export const loginUser = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const body: LoginInput = loginSchema.parse(req.body);
    const result = await loginUserService(body);
    res.status(StatusCodesEnum.OK).json(result);
  } catch (err) {
    res
      .status(StatusCodesEnum.Unauthorized)
      .json({ error: "Пользователь не авторизован" });
  }
};
