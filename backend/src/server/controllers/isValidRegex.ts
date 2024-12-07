/**
 * @filename - isValidRegex.ts
 * @author(s) - Joe Dahms
 * @purpose - Check if a regular expression is a valid JavaScript regular expression.
 */

/**
 * @function isValidRegex
 *
 * Check if a regex is valid or not
 *
 * @param pattern - The regex pattern to check the validity of.
 * @returns - Whether or not the regex is valid.
 */
export function isValidRegex (pattern: string): boolean {
  if (!pattern) {
    return false;
  }

  if (pattern.length > 100) {
    return false;
  }

  try {
    const testRegex = new RegExp(pattern);
    const testString = "test";
    testRegex.test(testString);

    return true;
  }
 catch (error: unknown) {
    return false;
  }
}
