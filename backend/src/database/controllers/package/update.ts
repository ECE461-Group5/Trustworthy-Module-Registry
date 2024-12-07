/**
 * @filename - update.ts
 * @author(s) - Joe Dahms, Jonah Salyers
 * @purpose - Update a package in the database. Updates content, url, debloat, and jsprogram.
 */

import logger from "../../../../logger.js";
import prisma from "../../prisma.js";
import { Package, nullPackageData } from "../../../server/controllers/package.js";

/**
 * @function dbUpdatePackage
 *
 * Update a package in the database. Updates content, url, debloat, and jsprogram.
 *
 * @param packageId - Id of the package to update
 * @param packageData - The data to be updated in the package
 * @returns - Void promise
 */
export const dbUpdatePackage = async (updatedPackage: Package): Promise<void | null> => {
  try {
    if (updatedPackage.metadata.ID != null && nullPackageData(updatedPackage) === false) {
      logger.info("Prisma update...");
      const updatedPackageId = Number(updatedPackage.metadata.ID);
      console.log(updatedPackage);

      const test = await prisma.package.update({
        where: { id: updatedPackageId },
        data: {
          content: updatedPackage.data.Content,
          url: updatedPackage.data.URL,
          debloat: updatedPackage.data.debloat,
          jsProgram: updatedPackage.data.JSProgram,
        },
      });
      console.log(test);
      logger.info("Prisma update successful");

      return;
    }
 else {
      return null;
    }
  }
 catch (error: any) {
    if (error?.code === "P2025") {
      // Record not found
      return null;
    }
    throw error; // Re-throw unexpected errors
  }
};
