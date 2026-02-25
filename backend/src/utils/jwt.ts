import jwt from "jsonwebtoken";
import type { User } from "../db/schema";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
