import type { Request, Response, NextFunction } from 'express';

import { logger } from '../config/logger.js';

export const loggerMiddleware = (
  { url, body, query, method, params }: Request,
  _res: Response,
  next: NextFunction
) => {
  const message = `url=${url}, method=${method}, ${
    Object.keys(body).length ? `body: ${JSON.stringify(body)},` : ''
  } ${Object.keys(query).length ? `query: ${JSON.stringify(query)},` : ''} ${
    Object.keys(params).length ? `query: ${JSON.stringify(params)}` : ''
  }`;

  logger.info(`${message} at ${new Date()}`);
  next();
};