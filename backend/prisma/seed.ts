import { hashPassword } from "better-auth/crypto";
import prisma from "../src/prisma";

async function seed() {
  const hashedPassword = await hashPassword("Admin123@");

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Admin",
      email: "admin@example.com",
      emailVerified: true,
      role: "ADMIN",
      accounts: {
        create: {
          accountId: "admin@example.com",
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  console.log("Admin user created:", user.email);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
