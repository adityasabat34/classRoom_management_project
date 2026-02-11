import express, { Application, Request, Response, NextFunction } from "express";
import logger from "./utils/logger";
import { auth } from "./utils/auth";
import { toNodeHandler } from "better-auth/node";

const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
  logger.info("Hello World!");
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
