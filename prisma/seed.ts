import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();


async function main() {
	const hashedPassword = await bcrypt.hash('123', 12);
	await prisma.user.create({
		data: {
			email: "admin@example.com",
			password: hashedPassword,
			full_name: "Super Admin",
			birth_date: new Date(),
			role: "ADMIN",
		}
	})
	console.log("Admin user created");
}

main()
	.catch(e => console.error(e))
	.finally(async () => await prisma.$disconnect());