import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import type { UserRole } from "../enums/UserRole.js";

export function authorize(roles: UserRole[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) return res.status(401).json({ error: "Token is required"});

			const token = authHeader.split(" ")[1];
			if (!token) return res.status(401).json({ error: "Token is required"});
			const payload: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
			console.log(payload);
			if (!roles.includes(payload.role)) {
				return res.status(403).json({ error: "Forbidden"});
			}

			req.user = {id: payload.sub, role: payload.role};
			next()
		} catch (err) {
			return res.status(401).json({error: "Invalid token"});
		}
	}
}