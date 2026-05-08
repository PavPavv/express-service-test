import type { Request, Response, NextFunction } from "express";
import {
  blockUserService,
  createUserService,
  getUserService,
  getUsersService,
  loginUserService,
} from "../services/users.js";
import { StatusCodesEnum } from "../shared/consts/index.js";
import { loginSchema } from "../shared/validators/user.validator.js";
import type { LoginInput } from "../shared/types/auth.js";
import { checkAccessByRole, checkAccessByRoleAndId, parseToken } from '../shared/utils/auth.js';

export const getUsers = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const token = req.headers['authorization']?.split(' ')[1] || '';
    const decodedToken = parseToken(token);
    const isAccessGranted = checkAccessByRole(decodedToken);

    if (!isAccessGranted) {
      res.status(StatusCodesEnum.Forbidden).json({ error: "Ошибка доступа." });
    } else {
      const users = await getUsersService();
      res.status(StatusCodesEnum.OK).json(users);;
    } 
};

export const postUser = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const data = req.body;
  const newUser = await createUserService(data);

  if (newUser) {
    res.status(StatusCodesEnum.SuccessfullyCreated).json(newUser);
  } else {
    res.status(StatusCodesEnum.Conflict).json({ error: "User already exists" });
  }
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

export const getUserById = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const token = req.headers['authorization']?.split(' ')[1] || '';
    const decodedToken = parseToken(token);
    const isAccessGranted = checkAccessByRoleAndId(decodedToken, String(id));

    if (!isAccessGranted) {
      res.status(StatusCodesEnum.Forbidden).json({ error: "Ошибка доступа." });
    } else {
      const result = await getUserService(id as string ?? '');
      res.status(StatusCodesEnum.OK).json({ result });
    }
  } catch (err) {
    res
      .status(StatusCodesEnum.NotFound)
      .json({ error: "Пользователь не найден" });
  }
};

export const blockUserById = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const token = req.headers['authorization']?.split(' ')[1] || '';
    const decodedToken = parseToken(token);
    const isAccessGranted = checkAccessByRoleAndId(decodedToken, String(id));

    if (!isAccessGranted) {
      res.status(StatusCodesEnum.Forbidden).json({ error: "Ошибка доступа." });
    } else {
      const result = await blockUserService(id as string ?? '');
      res.status(StatusCodesEnum.OK).json({ result });
    }
  } catch (err) {
    res
      .status(StatusCodesEnum.NotFound)
      .json({ error: "Пользователь не найден" });
  }
};
