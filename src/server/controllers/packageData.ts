/*
 * Author(s): Joe Dahms, Jonah Salyers
 * Purpose: Define the PackageData data type and a function to ensure that an object of said
 * type contains all the fields
 */

export interface PackageData {
  Content: Buffer;
  URL: string;
  debloat: boolean;
  JSProgram: string;
}

export function checkPackageData (packageData: PackageData): boolean {
  console.log(packageData);
  // All fields need to be present
  if (!("Content" in packageData)) {
    return false;
  }
  if (!("URL" in packageData)) {
    return false;
  }
  if (!("debloat" in packageData)) {
    return false;
  }
  if (!("JSProgram" in packageData)) {
    return false;
  }

  // Only one of URL or content can be set
  if (packageData.Content.byteLength != 0 && packageData.URL != "") {
    return false;
  }

  return true;
}
