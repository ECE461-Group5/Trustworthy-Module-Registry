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
): Promise<void | null> => {
  try {
    if (updatedPackage.metadata.ID != null && nullPackageData(updatedPackage) === false) {
      logger.info("Prisma update...");


      let packageContent: Buffer = Buffer.alloc(5);
      if (updatedPackage.data.Content != null) {
        packageContent = Buffer.from(updatedPackage.data.Content);
      }

      const test = await prisma.package.update({
        where: {
          id: packageId,
        },
        data: {
          content: packageContent,
          //          url: updatedPackage.data.URL,
                   debloat: updatedPackage.data.debloat,
          //        jsProgram: updatedPackage.data.JSProgram,
        },
      });
      logger.info("Prisma update successful");

      return;
    }
 else {
      return null;
    }
  }
 catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("here");
      if (error.code === "P2025") {
        return null;
      }
    }
    logger.error("Prisma update error: ", error);
    throw error;
  }
  /*
 catch (error: any) {
 
    logger.error("Prisma update error: ", error);
    if (error?.code === "P2025") {
      // Record not found
      return null;
    }
    throw error; // Re-throw unexpected errors
  }
*/
};
