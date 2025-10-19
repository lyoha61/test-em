import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import type { UserRole } from "../enums/UserRole.js";

export function authorize() {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) return res.status(401).json({ error: "Token is required"});

			const token = authHeader.split(" ")[1];
			if (!token) return res.status(401).json({ error: "Token is required"});
			const payload: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
			
			req.user = {id: payload.sub, role: payload.role};
			next()
		} catch (err) {
			return res.status(401).json({error: "Invalid token"});
		}
	}
}