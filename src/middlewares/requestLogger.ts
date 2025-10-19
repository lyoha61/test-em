import type { Request, Response, NextFunction } from "express"

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const { method, url} = req;
	const timestamp = new Date().toISOString().replace('Z', '').replace('T', ' ');
	console.log(`[${timestamp}] ${method} ${url}`);
	next();
}