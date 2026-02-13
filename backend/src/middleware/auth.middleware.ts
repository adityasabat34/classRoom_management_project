import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  sub: string;
  role: "student" | "teacher" | "admin";
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET as string;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (typeof decodedToken === "string") {
      return res.status(401).json({
        message: "Unauthorized: Invalid token payload",
      });
    }

    req.user = decodedToken as JwtPayload;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized token invalid" });
  }
};
