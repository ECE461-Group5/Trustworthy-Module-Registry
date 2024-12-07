/**
 * @filename - update.ts
 * @author(s) - Joe Dahms, Jonah Salyers
 * @purpose - Update a package in the database. Updates content, url, debloat, and jsprogram.
 */

import prisma from "../../prisma.js";
import { PackageData } from "../../../server/controllers/packageData.js";
import { Package } from "../../../server/controllers/package.js";

/**
 * @function dbUpdatePackage
 *
 * Update a package in the database. Updates content, url, debloat, and jsprogram.
 *
 * @param packageId - Id of the package to update
 * @param packageData - The data to be updated in the package
 * @returns - Void promise
 */
export const dbUpdatePackage = async (
  packageId: number,
  packageData: PackageData,
): Promise<void> => {
  try {
    const updatedPackage = await prisma.package.update({
      where: { id: packageId },
      data: {
        content: packageData.Content,
        url: packageData.URL,
        debloat: packageData.debloat,
        jsProgram: packageData.JSProgram,
      },
    });
    return;
  }
 catch (error: any) {
    if (error?.code === "P2025") {
      // Record not found
      return null;
    }
    throw error; // Re-throw unexpected errors
  }
};
