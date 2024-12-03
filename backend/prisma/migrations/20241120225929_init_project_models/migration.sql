-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" BYTEA,
    "url" TEXT,
    "debloat" BOOLEAN DEFAULT false,
    "jsProgram" TEXT,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageRating" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "rampUp" DOUBLE PRECISION NOT NULL,
    "correctness" DOUBLE PRECISION NOT NULL,
    "busFactor" DOUBLE PRECISION NOT NULL,
    "responsiveMaintainer" DOUBLE PRECISION NOT NULL,
    "licenseScore" DOUBLE PRECISION NOT NULL,
    "netScore" DOUBLE PRECISION NOT NULL,
    "rampUpLatency" DOUBLE PRECISION,
    "correctnessLatency" DOUBLE PRECISION,
    "busFactorLatency" DOUBLE PRECISION,
    "responsiveMaintainerLatency" DOUBLE PRECISION,
    "licenseScoreLatency" DOUBLE PRECISION,
    "netScoreLatency" DOUBLE PRECISION,

    CONSTRAINT "PackageRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackageRating" ADD CONSTRAINT "PackageRating_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
