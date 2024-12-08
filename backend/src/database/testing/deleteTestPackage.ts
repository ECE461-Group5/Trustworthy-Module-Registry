/**
 * @filename - deleteTestPackage.ts
 * @author(s) - Joe Dahms
 * @purpose - Delete test packages from database after running a test.
 */

import prisma from "../prisma.js";

/**
 * @function deleteContentPackage
 *
 * Delete a package based on ID. Used when a temporary package is uploaded to the database in the test suite.
 *
 * @param packageId - ID of the package to delete from the database.
 * @returns - Void promise indicating that the deletion has completed.
 */
export async function deleteContentPackage (packageId: number): Promise<void> {
  await prisma.package.delete({
    where: {
      id: Number(packageId),
    },
  });
  return;
}
