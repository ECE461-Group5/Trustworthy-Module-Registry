/*
 * Author(s): Jonah Salyers
 * Purpose: Handles retreival of package from database
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

  let packageContent = null;
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
