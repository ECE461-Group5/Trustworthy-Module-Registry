/**
 * @filename - retreive.ts
 * @author(s) - Jonah Salyers, Joe Dahms
 * @purpose - Handles retrieval of packages from within the database
 */

import prisma from "../../prisma.js";
import { Package } from "../../../server/controllers/package.js";

/**
 * @function dbGetPackage
 *
 * Get a package from the database based on its id. Package may not exist
 *
 * @param packageId
 * @returns - Promise resolved with either a Package or null. Package means the package was found in the
 * database, this is it. null means the package was not found in the database.
 */
export const dbGetPackage = async (packageId: number): Promise<Package | null> => {
  const packageData = await prisma.package.findUnique({
    where: { id: packageId },
  });

  // No such package
  if (!packageData) {
    return null;
  }

  const formattedId = packageData.id.toString().padStart(8, "0");


  // Buffer to string
  let packageContent: string = "";
  if (packageData.content != null) {
    packageContent = packageData.content.toString();
  }

  const returnPackage: Package = {
    metadata: {
      Name: packageData.name,
      Version: packageData.version,
      ID: formattedId,
    },
    data: {
      Content: packageContent,
      URL: packageData.url,
      debloat: packageData.debloat,
      JSProgram: packageData.jsProgram,
    },
  };

  return returnPackage;
};
