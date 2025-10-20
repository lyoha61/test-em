import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	const adminEmail = "admin@example.com";
	const existingUser = await prisma.user.findUnique({ where: {email: adminEmail} })

	if (!existingUser) {
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
		console.log("Admin created");
	}
}

main()
	.catch(e => console.error(e))
	.finally(async () => await prisma.$disconnect());