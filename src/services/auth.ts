import ms, { type StringValue } from "ms";
import type { LoginUserDto, TokensResponse } from "../dtos/auth.js";
import type { CreateUserDto } from "../dtos/user.js";
import type { PrismaClient, User } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions} from "jsonwebtoken";
import { HttpError } from "../errors/HttpError.js";

export class AuthService {
	private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExp: number;
  private readonly refreshExp: number;

  constructor(private readonly prisma: PrismaClient) {
    if (!process.env.JWT_ACCESS_SECRET ) throw new Error("JWT_ACCESS_SECRET is not set");
    if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not set");
    if (!process.env.ACCESS_TOKEN_EXPIRES_IN) throw new Error("ACCESS_TOKEN_EXPIRES_IN is not set");
    if (!process.env.REFRESH_TOKEN_EXPIRES_IN) throw new Error("REFRESH_TOKEN_EXPIRES_IN is not set");

    this.accessSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
    this.accessExp =  this.parseMs(process.env.ACCESS_TOKEN_EXPIRES_IN) / 1000;
    this.refreshExp = this.parseMs(process.env.REFRESH_TOKEN_EXPIRES_IN) / 1000;
  }

	protected parseMs(value: string): number {
		if (!value) throw new Error("Time value is not defined");

		const result = ms(value as StringValue);

		if (typeof result !== "number") {
			throw new Error(`Invalid time format ${value}`)
		}
		return result
	}

	protected signToken(payload: object, secret: Secret, options: SignOptions) {
		return jwt.sign(payload, secret, options);
	}

	protected async hashPassword(password: string) {
		const hashedPassword = await bcrypt.hash(password, 12);
		return hashedPassword;
	}

	protected async isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	async register(data: CreateUserDto): Promise<User> {
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

	async login(data: LoginUserDto): Promise<TokensResponse> {
		const user = await this.prisma.user.findUnique({
			where: {email: data.email}
		});

		if (!user) {
			throw new HttpError(400, 'Invalid inputs data');

		}

		if (!await this.isValidPassword(data.password, user?.password)) {
			throw new HttpError(400, 'Invalid inputs data');
		};

		const accessToken = this.signToken({sub: user.id, role: user.role}, this.accessSecret, {expiresIn: this.accessExp})
		const refreshToken = this.signToken({sub: user.id}, this.refreshSecret, {expiresIn: this.refreshExp})

		return {access_token: accessToken, refresh_token: refreshToken, exp: this.accessExp};
	}
}