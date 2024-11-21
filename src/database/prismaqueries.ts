// prismaqueries.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a new package
  const newPackage = await prisma.package.create({
    data: {
      name: 'Example Package',
      version: '1.0.0',
      url: 'https://github.com/example/repo',
    },
  });

  console.log('Created new package:', newPackage);

  // Create a rating for the package
  const packageRating = await prisma.packageRating.create({
    data: {
      packageId: newPackage.id,
      rampUp: 0.8,
      correctness: 0.9,
      busFactor: 0.7,
      responsiveMaintainer: 0.6,
      licenseScore: 1.0,
      netScore: 0.8,
    },
  });

  console.log('Created package rating:', packageRating);

  // Fetch all packages with their ratings
  const packages = await prisma.package.findMany({
    include: {
      ratings: true,
    },
  });

  console.log('All packages with ratings:', packages);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
