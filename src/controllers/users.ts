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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users (requires authentication, ADMIN role only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient permissions (not an ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns user data with authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict - user with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticates a user and returns user data with JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a specific user by their ID (requires authentication, ADMIN or own user only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient permissions (not an ADMIN and not the requested user)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/users/block/{id}:
 *   patch:
 *     summary: Block user by ID
 *     description: Blocks a specific user by their ID (sets status to INACTIVE, requires authentication, ADMIN or own user only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to block
 *     responses:
 *       200:
 *         description: User blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient permissions (not an ADMIN and not the requested user)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
