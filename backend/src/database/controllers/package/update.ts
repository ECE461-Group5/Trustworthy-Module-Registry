import prisma from "../../prisma.js";
import { PackageData } from "../../../server/controllers/packageData.js";
import { Package } from "../../../server/controllers/package.js";

export const dbUpdatePackage = async (
  packageId: number,
  packageData: PackageData,
): Promise<Package | null> => {
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

    const formattedId = updatedPackage.id.toString().padStart(8, '0');

    const returnPackage: Package = {
      metadata: {
        Name: updatedPackage.name,
        Version: updatedPackage.version,
        ID: formattedId,
      },
      data: {
        Content: updatedPackage.content,
        URL: updatedPackage.url,
        debloat: updatedPackage.debloat,
        JSProgram: updatedPackage.jsProgram,
      },
    };

    return returnPackage;
} catch (error: any) {
    if (error?.code === 'P2025') {
      // Record not found
      return null;
    }
    throw error; // Re-throw unexpected errors
  }
  };