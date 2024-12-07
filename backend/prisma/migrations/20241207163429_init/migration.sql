-- CreateTable
CREATE TABLE "PackageDependency" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "dependencyId" INTEGER NOT NULL,

    CONSTRAINT "PackageDependency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageDependency" ADD CONSTRAINT "PackageDependency_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageDependency" ADD CONSTRAINT "PackageDependency_dependencyId_fkey" FOREIGN KEY ("dependencyId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
