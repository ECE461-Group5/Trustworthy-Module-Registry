import prisma from "../../prisma.js";
import { PackageData } from "../../../server/controllers/packageData.js";
import { Package } from "../../../server/controllers/package.js";

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
