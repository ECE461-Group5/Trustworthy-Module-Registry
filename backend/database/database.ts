// src/database.ts
// Allows Prisma to work within the application

const { PrismaClient } = await import("@prisma/client");

const prisma = new PrismaClient();

export default prisma;
