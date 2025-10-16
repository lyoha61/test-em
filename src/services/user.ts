import type { PrismaClient } from "@prisma/client";
import type { CreateUserDto } from "../dtos/user.js";
import type { User } from "../generated/prisma/index.js";

export class UserService {
	constructor(private readonly prisma: PrismaClient) {}

	async getUser(id: string): Promise<User> {
		const user = this.prisma.user.findUnique({
			where: {id}
		});

		return user;
	}

}