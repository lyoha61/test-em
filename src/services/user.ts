import type { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
import { HttpError } from "../errors/HttpError.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class UserService {
	constructor(private readonly prisma: PrismaClient) {}

	async getUser(id: string): Promise<User | null> {
		const user = this.prisma.user.findUnique({
			where: {id}
		});

		return user;
	}

	async getUsers(excludeUserId?: string): Promise<User[]> {
		const users = await this.prisma.user.findMany({
			where: excludeUserId ? { id: { not: excludeUserId } } : {}
		});
		return users;
	}

	async blockUser(id: string): Promise<User> {
		try {
			const user = await this.prisma.user.update({
				where: {id},
				data: {
					is_active: false
				}
			});
	
			return user;
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
				throw new HttpError(404, 'User not found');
			}
			throw err;
		}
	}
}