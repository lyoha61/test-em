import z from "zod";

const emailShema = z.email({ 
	error: (issue) => {
		if (issue.input === undefined) return 'email is required';
		return "Invalid email";
	}  
});

const passwordShema = z.string("password is required").min(3, {error: "password must be contain 3 characters"});

export const registerShema = z.object({
	email: emailShema,
	password: passwordShema,
	full_name: z.string("full_name is required").regex(
		/^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)?$/,
		{ error: "Enter full_name in the format: Firstname Lastname Patronymic (patronymic is optional)"}
	),
	birth_date: z.string("birth_date is required")
});

export const loginShema = z.object({
	email: emailShema,
	password: passwordShema
})