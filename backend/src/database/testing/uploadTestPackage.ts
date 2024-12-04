/*
 * Author(s): Joe Dahms
 * Purpose: Upload packages to database for testing. Mocking was attempted for this purpose but abandoned due to no progress being made.
 */

import { Package } from "../../server/controllers/package.js";

export const uploadContentPackage = async (): Promise<string> => {
 const contentPackage: Package = {
    metadata: {
      Name: null,
      Version: null,
      ID: null,
    },
    data: {
      Content: "testContent",
      URL: "",
      debloat: false,
      JSProgram: "",
    },
  };

  const newPackage = await prisma.package.create({
    data: {
      name: contentPackage.Name,
      version: contentPackage.Version,
      content: contentPackage.Content,
      url: contentPackage.URL,
      debloat: contentPackage.debloat,
      jsProgram: contentPackage.JSProgram,
    },
  });
  // Assuming that the id will be a string.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return newPackage.id;
};




