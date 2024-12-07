/**
 * @filename - retreive.ts
 * @author(s) - Jonah Salyers
 * @purpose - Handles retrieval of packages from within the database
 */

import prisma from "../../prisma.js";
import { Package } from "../../../server/controllers/package.js";

export const dbGetPackage = async (packageId: number): Promise<Package | null> => {
  const packageData = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!packageData) {
    return null;
  }

  const formattedId = packageData.id.toString().padStart(8, "0");

  const returnPackage: Package = {
    metadata: {
      Name: packageData.name,
      Version: packageData.version,
      ID: formattedId,
    },
    data: {
      Content: packageData.content,
      URL: packageData.url,
      debloat: packageData.debloat,
      JSProgram: packageData.jsProgram,
    },
  };

  return returnPackage;
};
