import type { loginShema, registerShema } from "../schemes/auth.js";
import { z } from "zod";

export type CreateUserDto = z.infer<typeof registerShema>
export type LoginUserDto = z.infer<typeof loginShema>

export interface TokensResponse {
	refresh_token: string,
	access_token: string,
	exp: number,
}