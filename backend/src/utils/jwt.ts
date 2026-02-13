import jwt from "jsonwebtoken";
import type { User } from "../db/schema";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
};
