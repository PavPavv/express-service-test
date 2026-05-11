import type { Request, Response, NextFunction } from 'express';

import { logger } from '../config/logger.js';

export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};