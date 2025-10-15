import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { CreateUserDto } from "../dtos/user.js";
import type { User } from "../generated/prisma/index.js";

export class UserService {
	constructor(private readonly prisma: PrismaClient) {}

	protected async hashPassword(password: string) {
		const hashedPassword = await bcrypt.hash(password, 12);
		return hashedPassword;
	}

	async getUser(id: string): Promise<User> {
		const user = this.prisma.user.findUnique({
			where: {id}
		});

		return user;
	}

	async create(data: CreateUserDto): Promise<User> {
		const hashedPassword = await this.hashPassword(data.password);
		const [day, month, year] = data.birth_date.split(".");
	
		const birthDate = new Date(`${year}-${month}-${day}`);

		const user = await this.prisma.user.create({
			data: {
				full_name: data.full_name,
				email: data.email,
				birth_date: birthDate,
				password: hashedPassword
			}
		})
		return user;
	}
}