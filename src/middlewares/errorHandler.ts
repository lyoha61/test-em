import type { Request, Response, NextFunction } from "express"
import { HttpError } from "../errors/HttpError.js"

export function errorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
	if (err instanceof HttpError) {
		return res.status(err.statusCode).json({error: err.message});
	}

	console.error(err);
	res.status(500).json({error: "Internal Server Error" });
}