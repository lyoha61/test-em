import type { Request, Response, NextFunction } from "express";

export function responseLogger(req: Request, res: Response, next: NextFunction) {
	res.on("finish", () => {
		const timestamp = new Date().toISOString().replace('Z', '').replace('T', ' ');
		console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode}`);
	});

	next();
}