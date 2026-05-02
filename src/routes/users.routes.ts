import express from "express";
import { getUsers, loginUser, postUser } from '../controllers/users.js';

const usersRouter = express.Router();

// GET {baseUrl}/api/users/
usersRouter.get("/", getUsers);

usersRouter.post("/register", postUser);

usersRouter.post("/login", loginUser);

export default usersRouter;
