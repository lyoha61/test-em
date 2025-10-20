import type { UserService } from "../services/user.js";
import type { Request } from "express";
import { UserRole } from "../enums/UserRole.js";
import { HttpError } from "../errors/HttpError.js";
import { UserResponseSchema, UsersResponseSchema, type UserResponse, type UsersResponse } from "../schemes/user.js";

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

	async blockUser(req: Request, id: string): Promise<UserResponse> {
		const requester = req.user;

		if (requester?.role !== UserRole.ADMIN && requester?.id !== id) {
			throw new HttpError(403, 'Forbidden');
		}

		if (requester?.role === UserRole.ADMIN && requester?.id === id) {
			throw new HttpError(400, 'Admin can not block themselves');
		}

		const user = await this.userService.blockUser(id);

		return UserResponseSchema.parse(user);
	}
}