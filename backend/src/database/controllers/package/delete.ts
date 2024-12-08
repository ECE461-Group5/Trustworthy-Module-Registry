/**
 * @filename - delete.ts
 * @author(s) - Jonah Salyers, Joe Dahms
 * @purpose - Handles deleting packages stored within the Database (non-baseline)
 */

import prisma from "../../prisma.js";

/**
 * @function dbDeletePackage
 *
 * Deletes a package from the database.
 *
 * @param id - ID of the package to delete
 * @returns - Promise indicating whether or not the package was deleted
 */
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
