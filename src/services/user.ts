import type { PrismaClient } from "@prisma/client";
import type { User } from "../generated/prisma/index.js";

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
			where: { id: { not: excludeUserId } }
		});
		return users;
	}
}