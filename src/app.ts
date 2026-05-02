import express from "express";
import cors from 'cors';
import usersRouter from "./routes/users.routes.js";

// import { env } from "./config/env.ts";

export const createServer = () => {
  const app = express();

  // middlewares
  app.use(cors());
  app.use(express.json());

  // TODO: add logging

  // TODO: add rate limitimg

  // TODO: add health check

  // API роуты
  app.use("/api/users", usersRouter);


  // TODO: add 404 handler

  // TODO: add add global errors handler (service)

  return app;
};
