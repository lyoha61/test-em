import { Router, type NextFunction, type Request, type Response } from "express";
import { AuthController } from "../controllers/auth.js"
import { prisma } from "../db/client.js"
import { AuthService } from "../services/auth.js"
import { validateBody } from "../middlewares/validateBody.js";
import { loginShema, registerShema } from "../shemas/auth.js";

const authService = new AuthService(prisma)
const authController = new AuthController(authService)

export const authRouter = Router()

authRouter.post('/register', validateBody(registerShema),  async (req: Request, res: Response, next: NextFunction) => {
	const user = await authController.register(req.body);
	res.json(user);
});

authRouter.post('/login', validateBody(loginShema), async (req: Request, res: Response) => {
	const tokens = await authController.login(req.body);
	res.json(tokens);
});