/*
 * Author(s): Jonah Salyers
 * Purpose: Handles deleting a package within Database
 */

import prisma from "../../prisma.js";

export const dbDeletePackage = async (id: number): Promise<boolean> => {
  try {
    await prisma.package.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    // If the package does not exist, Prisma throws an error
    return false;
  }
};
