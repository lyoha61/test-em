import { z } from "zod";

const dateToString = () => 
	z.preprocess(
		(value) => (value instanceof Date ? value.toISOString() : value),
		z.string().datetime()
	)


export const UserResponseSchema = z.object({
	id: z.string(),
	email: z.string(),
	full_name: z.string(),
	birth_date: dateToString(),
	role: z.string(),
	is_active: z.boolean(),
	created_at: dateToString(),
	updated_at: dateToString(),
}).strip();

export const UsersResponseSchema = z.object({
	users: z.array(UserResponseSchema)
})

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;