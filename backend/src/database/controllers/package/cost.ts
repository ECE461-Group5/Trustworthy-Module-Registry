import prisma from "../../prisma.js";

export interface PackageCost {
  [packageId: string]: {
    standaloneCost?: number;
    totalCost: number;
  };
}

export const dbGetPackageCost = async (
  packageId: number,
  includeDependencies: boolean,
): Promise<PackageCost | null> => {
  try {
    // Find the main package by ID
    const mainPackage = await prisma.package.findUnique({
      where: { id: packageId },
      select: { id: true },
    });

    if (!mainPackage) {
      return null; // Package not found
    }

    const formattedId = packageId.toString().padStart(8, "0");

    if (includeDependencies) {
      // Fetch dependencies (placeholder logic)
      const dependencies = await prisma.packageDependency.findMany({
        where: { packageId },
        select: { dependencyId: true },
      });

      const dependencyCosts = dependencies.map((dep) => ({
        [dep.dependencyId.toString().padStart(8, "0")]: {
          standaloneCost: 0.5, // Placeholder cost
          totalCost: 0.5, // Placeholder cost
        },
      }));

      return {
        [formattedId]: {
          standaloneCost: 1.0, // Placeholder cost for the main package
          totalCost: 1.0 + dependencyCosts.reduce((sum, dep) => sum + dep.totalCost, 0),
        },
        ...dependencyCosts,
      };
    } else {
      // Only calculate standalone cost
      return {
        [formattedId]: {
          totalCost: 1.0, // Placeholder cost for the main package
        },
      };
    }
  } catch (error) {
    throw error; // Rethrow the error to be handled by the controller
  }
};
