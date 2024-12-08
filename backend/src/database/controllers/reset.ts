/**
 * @filename - reset.ts
 * @author(s) - Logan Pelkey
 * @purpose - implement requests to the /reset endpoint.
 */


import prisma from "../prisma.js";
import logger from "../../../logger.js";

/**
 * @function dbResetRegistry
 *
 * Resets the entire package registry by deleting all records in the relevant tables.
 *
 * @returns {Promise<boolean>} - Returns true if successful, otherwise false.
 */
export const dbResetRegistry = async (): Promise<boolean> => {
    try {
      // Delete all entries from the main tables using Prisma
      await prisma.$transaction([
          prisma.packageRating.deleteMany(),
          prisma.package.deleteMany(),
      ]);
  
      logger.info("Package registry reset successfully.");
      return true;
    } catch (error) {
      logger.error("Error resetting package registry:", error);
      return false;
    }
  };
