/*
  Warnings:

  - A unique constraint covering the columns `[packageId]` on the table `PackageRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PackageRating_packageId_key" ON "PackageRating"("packageId");
