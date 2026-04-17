import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", (_req, res, _next) => {
  res.status(200).json([{ id: 1, name: "Jack" }]);
});

export default usersRouter;
