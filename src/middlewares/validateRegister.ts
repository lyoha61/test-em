import z, { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError.js";

const registerShema = z.object({
	email: z.email({ error: "Некорректный email" }),
	password: z.string().min(3, {error: "Пароль должен быть минимум 3 символа"}),
	full_name: z.string("Поле full_name обязательно").regex(
		/^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)?$/,
		{ error: "Введите ФИО в формате: Имя Фамилия Отчество (отчество опционально)"}
	),
	birth_date: z.string("Поле birth_date обязательно")
})

export function validateRegister(req: Request, res: Response, next: NextFunction) {
	const result = registerShema.safeParse(req.body);
	if (!result.success) {
		const message = result.error.issues.map(issue => issue.message).join(", ");
		return next(new HttpError(400, message));
	}
	next();	
}