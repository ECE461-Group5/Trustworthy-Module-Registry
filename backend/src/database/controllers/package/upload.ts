/*
 * Author(s): Joe Dahms, Jonah Salyers
 * Purpose: Handle uploading a package to the database. Currently using prisma.
 */

import { Package } from "../../../server/controllers/package.js";
import prisma from "../../prisma.js";

/*
 * Purpose: Upload a package to the database using prisma and return back the uploaded package
 * Input:
 * - The package to upload
 * Output: The uploaded package
 */

export const dbUploadPackage = async (_package: Package): Promise<Package> => {
  // Add package to database
  const newPackage = await prisma.package.create({
    data: {
      name: "noname",
      version: "noversion",
      content: _package.data.Content,
      url: _package.data.URL,
      debloat: _package.data.debloat,
      jsProgram: _package.data.JSProgram,
    },
  });
  // Create 8 digit ID
  const formattedId = newPackage.id
  ? newPackage.id.toString().padStart(8, "0")
  : null; // Handle undefined ID gracefully
  // Return new package
  const test: Package = {
    metadata: {
      Name: newPackage.name,
      Version: newPackage.version,
      ID: formattedId,
    },
    data: {
      Content: newPackage.content,
      URL: newPackage.url,
      debloat: newPackage.debloat,
      JSProgram: newPackage.jsProgram,
    },
  };
  return test;
};
