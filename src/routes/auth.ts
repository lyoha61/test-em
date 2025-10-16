import { Router, type Request, type Response } from "express";
import { AuthController } from "../controllers/auth.js"
import { prisma } from "../db/client.js"
import { AuthService } from "../services/auth.js"

const authService = new AuthService(prisma)
const authController = new AuthController(authService)

export const authRouter = Router()

authRouter.post('/register', async (req: Request, res: Response) => {
	const user = await authController.register(req.body);
	res.json(user);
});

authRouter.post('/login', async (req: Request, res: Response) => {
	const tokens = await authController.login(req.body);
	res.json(tokens);
});