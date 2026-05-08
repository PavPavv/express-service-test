import express from "express";
import { blockUserById, getUserById, getUsers, loginUser, postUser } from "../controllers/users.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const usersRouter = express.Router();

// GET {baseUrl}/api/users/

// public routes
usersRouter.post("/register", postUser);
usersRouter.post("/login", loginUser);

usersRouter.use(authMiddleware);

// private routes
usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUserById);
usersRouter.patch("/block/:id", blockUserById);

export default usersRouter;
