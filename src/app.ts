import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express'

import { swaggerSpec } from './config/swagger.js'
import usersRouter from "./routes/users.routes.js";
import { StatusCodesEnum } from "./shared/consts/status-codes.js";

import { env } from "./config/env.js";
import { loggerMiddleware } from './middleware/log.middleware.js';
import { logger } from './config/logger.js';

export const createServer = () => {
  const app = express();

  // middlewares
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(loggerMiddleware)

   // Rate limiting
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
    })
  )

  /**
   * @swagger
   * /check:
   *   get:
   *     summary: Health check endpoint
   *     description: Returns server status to verify API is running
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Server is running
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "ok"
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.get("/check", (_req, res) => {
    res.status(StatusCodesEnum.OK).json({ status: "ok" });
  });

  // API роуты
  app.use("/api/users", usersRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(StatusCodesEnum.NotFound).json({ error: 'Resource not found' });
  });

  // Обработчик глобальных ошибок
  app.use((
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    logger.error({ err }, 'Unhandled error');

    res.status(StatusCodesEnum.InternalServerError).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  })

  return app;
};
