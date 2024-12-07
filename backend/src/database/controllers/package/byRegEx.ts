/**
 * @filename - byRegEx.ts
 * @author(s) - Jonah Salyers
 * @purpose - Handles finding and presenting a package based off of Regular Expression
 */

import prisma from "../../prisma.js";
import { Package } from "../../../server/controllers/package.js";

/**
 * Fetch packages from the database based on a regex pattern.
 * Uses `contains` for simple pattern matching.
 * @param regex The regex string to match against package names.
 * @returns Array of matching packages or an empty array if none are found.
 */
export const dbGetPackagesByRegEx = async (regex: string): Promise<Package[]> => {
  try {
    // Convert the regex pattern to a simple substring match
    const sanitizedRegex = regex.replace(/[^a-zA-Z0-9]/g, ""); // Sanitize regex for security

    const packageData = await prisma.package.findMany({
      where: {
        name: {
          contains: sanitizedRegex, // Match packages whose name contains the pattern
          mode: "insensitive", // Case-insensitive matching
        },
      },
    });

    // Map the Prisma query results to the Package interface
    const packages: Package[] = packageData.map((pkg) => ({
      metadata: {
        Name: pkg.name,
        Version: pkg.version,
        ID: pkg.id.toString().padStart(8, "0"),
      },
      data: {
        Content: pkg.content,
        URL: pkg.url,
        debloat: pkg.debloat,
        JSProgram: pkg.jsProgram,
      },
    }));

    return packages;
  } catch (error) {
    throw error;
  }
};
