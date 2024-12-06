/*
 * Author(s): Joe Dahms
 * Purpose: Delete test packages from database after running a test.
 */

import prisma from "../prisma.js";

export async function deleteContentPackage(packageId: number): Promise<void> {
  await prisma.package.delete({
    where: {
      id: packageId,
    },
  });
  return;
}
