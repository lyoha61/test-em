import type { CreateUserDto, LoginUserDto, TokensResponse } from "../dtos/auth.js";
import type { AuthService } from "../services/auth.js";
import { UserResponseSchema, type UserResponse } from "../schemes/user.js";

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	async register(body: CreateUserDto): Promise<UserResponse> {
		const user = await this.authService.register(body);
		const formattedUser = UserResponseSchema.parse(user);
		return formattedUser;
	}

	async login(body: LoginUserDto): Promise<TokensResponse> {
		const tokens = await this.authService.login(body);
		return tokens;
	}
}
