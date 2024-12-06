/**
 * @filename - database.ts
 * @author(s) - Juan, Jonah Salyers
 * @purpose - Set up a prisma object so that prisma can be used to operate on the database.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
