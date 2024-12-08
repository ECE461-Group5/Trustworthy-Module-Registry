/**
 * @filename - uploadTestPackage.ts
 * @author(s) - Joe Dahms
 * @purpose - Upload packages to database for testing. Mocking was attempted for this purpose but abandoned due to no progress being made.
 * Packages are just uploaded to the database temporarily with the expectation that they will be deleted after the test runs.
 */

import prisma from "../prisma.js";
import { Package } from "../../server/controllers/package.js";

/**
 * @function uploadContentPackage
 *
 * Upload a temporary package to the database for testing. Package is a content package meaning its content field is set as opposed to its url field.
 *
 * @param none
 * @returns - Promise resolved with a Package. The package object contains info about the package that was uploaded to the database.
 */
export async function uploadContentPackage (): Promise<Package> {
  const contentPackage: Package = {
    metadata: {
      Name: null,
      Version: null,
      ID: "00000000",
    },
    data: {
      Content: "TESTSSTESTSGSDFHSDRH",
      URL: "",
      debloat: false,
      JSProgram: "",
    },
  };

  const newPackage = await prisma.package.create({
    data: {
      name: "testContent",
      version: "noversion",
      content: Buffer.from(contentPackage.data.Content),
      url: contentPackage.data.URL,
      debloat: contentPackage.data.debloat,
      jsProgram: contentPackage.data.JSProgram,
    },
  });

  contentPackage.metadata.Name = newPackage.name;
  contentPackage.metadata.Version = newPackage.version;

  // Return id with proper number of digits
  let newPackageId = String(newPackage.id);
  newPackageId = newPackageId.padStart(8, "0");
  contentPackage.metadata.ID = newPackageId;

  return contentPackage;
}

export async function uploadURLPackage (): Promise<Package> {
  const contentPackage: Package = {
    metadata: {
      Name: null,
      Version: null,
      ID: "00000000",
    },
    data: {
      Content: "as;ldkfja;sldfkjadf",
      URL: "https://github.com/cloudinary/cloudinary_npm",
      debloat: false,
      JSProgram: "",
    },
  };

  if (contentPackage.data.Content === null) {
    return contentPackage;
  }
  const packageContent = Buffer.from(contentPackage.data.Content);

  const newPackage = await prisma.package.create({
    data: {
      name: "testContent",
      version: "noversion",
      content: packageContent,
      url: contentPackage.data.URL,
      debloat: contentPackage.data.debloat,
      jsProgram: contentPackage.data.JSProgram,
    },
  });

  contentPackage.metadata.Name = newPackage.name;
  contentPackage.metadata.Version = newPackage.version;

  // Return id with proper number of digits
  let newPackageId = String(newPackage.id);
  newPackageId = newPackageId.padStart(8, "0");
  contentPackage.metadata.ID = newPackageId;

  return contentPackage;
}
