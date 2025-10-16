import type { Request, Response, NextFunction } from "express"

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const { method, url, body, params, query } = req;
	const date = new Date().toLocaleString();
	console.log(`[${date}] ${method} ${url}`);
	next();
}