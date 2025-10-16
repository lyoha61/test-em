import type { UserService } from "../services/user.js";
import { UserResponseSchema, type CreateUserDto, type UserResponse } from "../dtos/user.js";

export class UserController {
	constructor (private readonly userService: UserService) {}

	async getUser(id: string): Promise<UserResponse> {
		const user = await this.userService.getUser(id);
		const formattedUser = UserResponseSchema.parse(user);
		return formattedUser;
	}
}