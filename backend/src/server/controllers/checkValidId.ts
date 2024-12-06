/*
 * Author(s): Joe Dahms, Jonah Salyers
 * Purpose: Check if an id is valid. Has to be a positive 8 digit number.
 */

export function checkValidId(packageIdString: string): boolean {
  // Validate that package ID is exactly 8 digits
  const packageIdRegex = /^\d{8}$/;
  if (!packageIdRegex.test(packageIdString)) {
    // Return 400 Bad Request with no response body
    return false;
  }

  // Number
  if (isNaN(Number(packageIdString))) {
    return false;
  }

  // Positive
  const packageId = parseInt(packageIdString, 10);
  if (packageId < 0) {
    return false;
  }

  return true;
}
