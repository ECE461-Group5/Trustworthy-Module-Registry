/**
 * @filename - delete.ts
 * @author(s) - Jonah Salyers
 * @purpose - Handles deleting packages stored within the Database (non-baseline)
 */

import prisma from "../../prisma.js";

export const dbDeletePackage = async (id: number): Promise<boolean> => {
  try {
    await prisma.package.delete({
      where: { id },
    });
    return true;
  }
 catch (error) {
    // If the package does not exist, Prisma throws an error
    return false;
  }
};

