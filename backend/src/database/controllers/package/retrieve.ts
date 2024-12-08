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
 * Upload a temporary package to the database for testing. Package is a content package meaning its content field is set as opposed to its url field.
 *
 * @param none
 * @returns - Promise resolved with a Package. The package object contains info about the package that was uploaded to the database.
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
  let packageContent: string = null;
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
