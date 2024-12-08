/*
  Warnings:

  - Added the required column `goodPinningPractice` to the `PackageRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pullRequest` to the `PackageRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackageRating" ADD COLUMN     "goodPinningPractice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "goodPinningPracticeLatency" DOUBLE PRECISION,
ADD COLUMN     "pullRequest" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pullRequestLatency" DOUBLE PRECISION;
