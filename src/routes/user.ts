import { Router, type Request, type Response } from "express";
import { UserController } from "../controllers/user.js";
import { UserService } from "../services/user.js";
import { prisma } from "../db/client.js";
import type { UserParams } from "../types/user.js";

const userService = new UserService(prisma)
const userController = new UserController(userService);

export const userRouter = Router();

userRouter.get('/', async (req: Request, res: Response) => {
	const users = await userController.getUsers(req);
	res.json(users)
})

userRouter.get('/:id', async (req: Request<UserParams>, res: Response) => {
	const user = await userController.getUser(req, req.params.id);
	res.json(user)
});

