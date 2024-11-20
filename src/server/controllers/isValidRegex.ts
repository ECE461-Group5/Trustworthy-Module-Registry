/*
 * Author(s): Joe Dahms
 * Purpose: Check if a regular expression is a valid JavaScript regular expression.
*/

export function isValidRegex (pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  }
  catch (error: unknown) {
    return false;
  }
}
