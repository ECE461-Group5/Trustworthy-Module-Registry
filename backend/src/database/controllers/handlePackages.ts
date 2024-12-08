/**
 * @filename - handlePackages.ts
 * @author(s) - Logan Pelkey
 * @purpose - Handle incoming requests to the /packages endpoint.
 */
import prisma from "../prisma.js";
import { PackageResponse } from "../../server/controllers/package.js";

/**
 * @function dbGetPackagesByQuery
 * Queries the database to retrieve packages based on the provided criteria.
 * @param name - The package name.
 * @param version - The package version (supports multiple formats).
 * @returns - A list of matching packages.
 */
export const dbGetPackagesByQuery = async (
    name: string,
    version: string,
    offset: number,
    limit: number
  ): Promise<PackageResponse[]> => {
    const versionQuery = parseVersion(version);
  
    const packages = await prisma.package.findMany({
      where: {
        name: name === "*" ? undefined : name,
        version: versionQuery,
      },
      skip: offset,
      take: limit,
      select: {
        name: true,
        version: true,
        id: true,
      },
    });
  
    return packages.map((pkg) => ({
      Name: pkg.name,
      Version: pkg.version,
      ID: pkg.id.toString().padStart(8, "0"),
    }));
  };

  /**
 * @function parseVersion
 * Converts the input version string into a Prisma-compatible query.
 * @param version - The version string from the input.
 * @returns - A Prisma query object for the `version` field.
 */
  const parseVersion = (version: string) => {
    // Handle wildcard '*': Match any version
    if (version === "*") {
      return undefined; // No filter for version
    } 
  
    // Handle exact match: "X.X.X"
    else if (/^\d+\.\d+\.\d+$/.test(version)) {
      return version;
    } 
  
    // Handle caret (^X.X.X): Match all versions with the same major version
    else if (/^\^(\d+)\.(\d+)\.(\d+)$/.test(version)) {
      const [major] = version.match(/\d+/g) || [];
      return { startsWith: `${major}.` };
    } 
  
    // Handle tilde (~X.X.X): Match all versions with the same major and minor version
    else if (/^~(\d+)\.(\d+)\.(\d+)$/.test(version)) {
      const [major, minor] = version.match(/\d+/g) || [];
      return { startsWith: `${major}.${minor}.` };
    } 
  
    // Handle range (X.X.X-X.X.X): Match all versions in the range
    else if (/^\d+\.\d+\.\d+-\d+\.\d+\.\d+$/.test(version)) {
      const [min, max] = version.split("-");
      return { gte: min, lte: max };
    } 
  
    // Throw error for unsupported formats
    else {
      throw new Error("Unsupported version format");
    }
  };
  