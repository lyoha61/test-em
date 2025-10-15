import { PrismaClient } from "../generated/prisma/index.js";


export const prisma = new PrismaClient();

export async function connectDatabase() {
	try {
		await prisma.$connect();
		console.log("Connected to database");
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Database connection failed", err.message)
		} else { 
			console.error("Database connection failed", err)
		}
		process.exit(1);
	}
}