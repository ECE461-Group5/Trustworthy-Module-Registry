/**
 * @filename - packagesController.ts
 * @author(s) - Joe Dahms, Logan Pelkey
 * @purpose - Handle incoming requests to the /packages endpoint.
 */

import { Request, Response } from "express";
import { PackageResponse } from "./package.js";
import { dbGetPackagesByQuery } from "../../database/controllers/handlePackages.js";
/**
 * @function getPackages
 *
 * Get multiple packages from the database.
 *
 * @param req- The request object coming in. Expected to only contain an array of packages.
 * @param res- The response to send back.
 * @returns - void
 */
export const getPackages = async (req: Request, res: Response): Promise<void> => {
  const requestBody = req.body;
  const offset = parseInt(req.query.offset as string) || 0; // Default to 0 if not provided
  const limit = 10; // Fixed page size, can be made dynamic if needed

  if (!Array.isArray(requestBody) || requestBody.some(pkg => !pkg.Name || !pkg.Version)) {
    res.status(400).json({ error: "Invalid package format: missing Name or Version" });
    return;
  }  

  try {
    const results: PackageResponse[] = [];

    for (const pkg of requestBody) {
      const matchingPackages = await dbGetPackagesByQuery(pkg.Name, pkg.Version, offset, limit);
      results.push(...matchingPackages);
    }

    if (results.length === 0) {
      res.status(404).json({ error: "No matching packages found" });
      return;
    }

    res.status(200).json({
      offset: offset,
      limit: limit,
      total: results.length,
      packages: results,
    });
  } catch (error) {
    console.error("Error retrieving packages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
