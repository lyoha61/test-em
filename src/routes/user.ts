import { Router, type Request, type Response } from "express";
import { UserController } from "../controllers/user.js";
import { UserService } from "../services/user.js";
import { prisma } from "../db/client.js";

const userService = new UserService(prisma)
const userController = new UserController(userService);

export const userRouter = Router();

userRouter.get('/:id', async (req: Request, res: Response) => {
	if (!req.params.id) {
		return res.status(400).json({ error: "user id required" });
	}
	const user = await userController.getUser(req.params.id);
	res.json(user)
});

