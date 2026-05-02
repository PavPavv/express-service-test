import type { Request, Response, NextFunction } from "express";
import { StatusCodesEnum } from "../shared/consts/status-codes.js";
import { verifyToken } from "../shared/utils/auth.js";
import type { TokenPayload } from "../shared/types/auth.js";

// TODO: ??
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(StatusCodesEnum.Unauthorized)
        .json({ error: "Authorization token required" });
      return;
    }

    // Сам token, без 'Bearer '
    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch (err) {
    res
      .status(StatusCodesEnum.Unauthorized)
      .json({ error: "Invalid or expired token" });
  }
};
