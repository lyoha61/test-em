export interface LoginUserDto {
	email: string,
	password: string,
}

export interface TokensResponse {
	refresh_token: string,
	access_token: string,
	exp: number,
}