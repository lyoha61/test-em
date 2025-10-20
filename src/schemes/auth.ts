import z from "zod";

const parseDate = (value: unknown) => {
	if (typeof value !== 'string') return null;

	const match = value.match(/^(\d{2})([.\-])(\d{2})\2(\d{4})$/)
	if(!match) return null;

	const [_, dayStr, sep, monthStr, yearStr] = match;
	const day = Number(dayStr);
	const month = Number(monthStr) - 1;
	const year = Number(yearStr);
	const date = new Date(Date.UTC(year,month, day));
	
	return isNaN(date.getTime()) ? null : date;
}

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
	birth_date: z.preprocess(parseDate, z.date({error: (issue) => {
		if (issue.input === undefined) return 'birth_date is required';
		return `Invalid format date. Use DD-MM-YYYY or DD.MM.YYYY`
	}})) 
});

export const loginShema = z.object({
	email: emailShema,
	password: passwordShema
})