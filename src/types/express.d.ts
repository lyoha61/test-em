import type { UserRole } from "../enums/UserRole";

declare global {
	namespace Express {
		interface User {
			id: string;
			role: UserRole;
		}

		interface Request {
			user?: User;
		}
	}
}