import express from "express";
import usersRouter from "./routes/users.routes.ts";

// import { env } from "./config/env.ts";

export const createServer = () => {
  const app = express();

  // TODO: add middlewares

  // TODO: add logging

  // TODO: add rate limitimg

  // TODO: add health check

  // API роуты
  // REMOVE: тестовый роут
  app.get("/", (_req, res) => {
    res.send("Hi!");
  });

  app.use("/api/users", usersRouter);

  // TODO: add 404 handler

  // TODO: add add global errors handler (service)

  return app;
};
