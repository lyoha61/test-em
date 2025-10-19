import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError.js";
import type { ZodType } from "zod";

export function validateBody<T>(shema: ZodType<T>) {
	return (
		req: Request<unknown, unknown, T>, 
		res: Response, 
		next: NextFunction
	) => {
		const result = shema.safeParse(req.body);
		if (!result.success) {
			const message = result.error.issues.map(issue => issue.message).join(", ");
			return next(new HttpError(400, message));
		}
		req.body = result.data;
		next();	
	}
}