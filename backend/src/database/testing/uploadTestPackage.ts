/*
 * Author(s): Joe Dahms
 * Purpose: Upload packages to database for testing. Mocking was attempted for this purpose but abandoned due to no progress being made.
 */

import prisma from "../prisma.js";
import { Package } from "../../server/controllers/package.js";

export const uploadContentPackage = async (): Promise<number> => {
  const contentPackage: Package = {
    metadata: {
      Name: null,
      Version: null,
      ID: null,
    },
    data: {
      Content: Buffer.from("TESTSSTESTSGSDFHSDRH"),
      URL: "",
      debloat: false,
      JSProgram: "",
    },
  };

  const newPackage = await prisma.package.create({
    data: {
      name: "noname",
      version: "noversion",
      content: contentPackage.data.Content,
      url: contentPackage.data.URL,
      debloat: contentPackage.data.debloat,
      jsProgram: contentPackage.data.JSProgram,
    },
  });
  return newPackage.id;
};
