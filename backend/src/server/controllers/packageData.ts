/**
 * @filename - packageData.ts
 * @author(s) - Joe Dahms, Jonah Salyers
 * @purpose - Define the PackageData data type and a function to ensure that an object of said
 * type contains all the fields
 */

import logger from "../../../logger.js";

export interface PackageData {
  Content: Buffer;
  URL: string;
  debloat: boolean;
  JSProgram: string;
}

/**
 * @function checkPackageData
 *
 * Check if package data is in the expected format
 *
 * @param packageData - Object to check formatting on
 * @returns Whether or not the package data is formatted properly
 */
export function checkPackageData (packageData: PackageData): boolean {
  logger.info(`Checking package data object: ${packageData}`);

  // All fields need to be present
  if (!("Content" in packageData)) {
    logger.info("PackageData invalid due to missing or malformed Content key");
    return false;
  }
  if (!("URL" in packageData)) {
    logger.info("PackageData invalid due to missing or malformed URL key");
    return false;
  }
  if (!("debloat" in packageData)) {
    logger.info("PackageData invalid due to missing or malformed debloat key");
    return false;
  }
  if (!("JSProgram" in packageData)) {
    logger.info("PackageData invalid due to missing or malformed key");
    return false;
  }
  logger.info("All fields present");

  /*
  // Only one of URL or content can be set
  if (packageData.Content.byteLength != 0 && packageData.URL != "") {
    return false;
  }
  */

  let contentSet = true;
  let urlSet = true;

  if (packageData.Content.length === 0) {
    contentSet = false;
    logger.info("Content not set");
  }
  if (packageData.URL === "") {
    urlSet = false;
    logger.info("URL not set");
  }

  if (contentSet === true && urlSet === true) {
    logger.info("Both Content and URL set, package data in invalid");
    return false;
  }

  logger.info("Package data is valid");
  return true;
}
