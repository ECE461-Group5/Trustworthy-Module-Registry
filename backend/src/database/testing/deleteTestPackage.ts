/*
 * Author(s): Joe Dahms
 * Purpose: Delete test packages from database after running a test.
 */

export const deleteContentPackage = async (packageId: string): Promise<> => {
  const deleteUser = await prisma.user.delete({
  where: {
    id: packageId,
  },
});
};

