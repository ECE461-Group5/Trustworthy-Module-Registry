/**
 * @filename - package.ts
 * @author(s) - Joe Dahms
 * @purpose - Interface for a package. Helps ensure that each field of a package is of an expected type.
 */

import logger from "../../../logger.js";

export interface Package {
  metadata: {
    Name: string | null;
    Version: string | null;
    ID: number | string | null;
  };
  data: {
    Content: string | null;
//    Content: Buffer | null;
    URL: string | null;
    debloat: boolean | null;
    JSProgram: string | null;
  };
}

/**
 * @function nullPackageData
 *
 * Check if any of the data fields are null
 *
 * @param packageToCheck - Package to check
 * @returns - True if any null fields in data, false if no null fields in data
 */
export function nullPackageData (packageToCheck: Package): boolean {
  logger.info("Checking if package data has any null fields...");
  let nullData = false;
  if (packageToCheck.data.Content === null) {
    logger.info("Content null");
    nullData = true;
  }
 else if (packageToCheck.data.URL === null) {
    logger.info("URL null");
    nullData = true;
  }
 else if (packageToCheck.data.debloat === null) {
    logger.info("debloat null");
    nullData = true;
  }
 else if (packageToCheck.data.JSProgram === null) {
    logger.info("JSProgram null");
    nullData = true;
  }

  logger.info("No null fields");
  return nullData;
}
