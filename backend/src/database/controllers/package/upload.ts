/*
 * Author(s): Joe Dahms
 * Purpose: Handle uploading a package to the database. Currently using prisma.
 */

import { Package } from "../../../server/controllers/package.js";
import prisma from "../../prisma.js";
import { Buffer } from "buffer";

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

  // Return new package
  const test: Package = {
    metadata: {
      Name: newPackage.name,
      Version: newPackage.version,
      ID: newPackage.id,
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