import type { UserService } from "../services/user.js";
import { UserResponseSchema, UsersResponseSchema, type UserResponse, type UsersResponse } from "../dtos/user.js";
import type { Request } from "express";
import { UserRole } from "../enums/UserRole.js";
import { HttpError } from "../errors/HttpError.js";

export class UserController {
	constructor (private readonly userService: UserService) {}

	async getUser(req: Request, id: string): Promise<UserResponse> {
		const requester = req.user;
		
		if(requester?.role !== UserRole.ADMIN && requester?.id !== id) {
			throw new HttpError(403, 'Forbidden');
		}

		const user = await this.userService.getUser(id);
		
		if(!user) {
			throw new HttpError(404, "User not found")
		}

		const formattedUser = UserResponseSchema.parse(user);
		return formattedUser;
	}

	async getUsers(req: Request): Promise<UsersResponse> {
		const requester = req.user;
		
		if(requester?.role !== UserRole.ADMIN) {
			throw new HttpError(403, 'Forbidden');
		}
		const adminId = requester.id;
		
		const users = await this.userService.getUsers(adminId);
		return UsersResponseSchema.parse({users})
	}
}