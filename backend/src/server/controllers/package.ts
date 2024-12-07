/**
 * @filename - package.ts
 * @author(s) - Joe Dahms
 * @purpose - Interface for a package. Helps ensure that each field of a package is of an expected type.
 */

export interface Package {
  metadata: {
    Name: string | null;
    Version: string | null;
    ID: number | string | null;
  };
  data: {
    Content: Buffer | null;
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
  let nullData = false;
  if (
    packageToCheck.data.Content != null ||
    packageToCheck.data.URL != null ||
    packageToCheck.data.debloat != null ||
    packageToCheck.data.JSProgram != null
  ) {
    nullData = true;
  }

  return nullData;
}
