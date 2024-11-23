// src/database.ts
// Allows Prisma to work within the application

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;