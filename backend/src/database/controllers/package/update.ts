/**
 * @filename - update.ts
 * @author(s) - Joe Dahms, Jonah Salyers
 * @purpose - Update a package in the database. Updates content, url, debloat, and jsprogram.
 */

import logger from "../../../../logger.js";
import prisma from "../../prisma.js";
import { Package, nullPackageData } from "../../../server/controllers/package.js";
import { Prisma } from "@prisma/client";

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
  updatedPackage: Package,
): Promise<number> => {
  if (updatedPackage.metadata.ID != null && nullPackageData(updatedPackage) === false) {
    logger.info("Prisma update...");

    if (updatedPackage.data.Content === null) {
      return 400;
    }
    const packageContent = Buffer.from(updatedPackage.data.Content);

    logger.info("Checking that package exists...");
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
    });
    if (!packageData) {
      logger.info("Package does not exist");
      return 404;
    }
    logger.info("Package exists");

    const test = await prisma.package.update({
      where: {
        id: packageId,
      },
      data: {
        content: packageContent,
        url: updatedPackage.data.URL,
        debloat: updatedPackage.data.debloat,
        jsProgram: updatedPackage.data.JSProgram,
      },
    });
    logger.info("Prisma update successful");

    return 200;
  }
 else {
    return 400;
  }
};
