import prisma from "../../prisma.js";

export interface PackageCost {
  standaloneCost: number; // Cost in MB
  totalCost: number; // Cost in MB
}

/**
 * Get package cost in MB, including dependencies if specified.
 */
export const dbGetPackageCost = async (
  packageId: number,
  includeDependencies: boolean
): Promise<PackageCost | null> => {
  try {
    // Fetch package details
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      select: { content: true, id: true },
    });

    if (!packageData || !packageData.content) {
      return null;
    }

    // Calculate standalone cost (size of the package content in MB)
    const standaloneCost = Buffer.byteLength(packageData.content) / (1024 * 1024); // Convert bytes to MB

    if (!includeDependencies) {
      return { standaloneCost, totalCost: standaloneCost };
    }

    // Fetch dependencies (assuming dependencies are stored in a `packageDependency` table)
    const dependencies = await prisma.packageDependency.findMany({
      where: { packageId },
      include: { dependency: { select: { content: true } } },
    });

    // Calculate the total cost of dependencies
    let dependencyCost = 0;
    for (const dep of dependencies) {
      if (dep.dependency?.content) {
        dependencyCost += Buffer.byteLength(dep.dependency.content) / (1024 * 1024); // Convert to MB
      }
    }

    const totalCost = standaloneCost + dependencyCost;

    return { standaloneCost, totalCost };
  } catch (error) {
    throw error;
  }
};