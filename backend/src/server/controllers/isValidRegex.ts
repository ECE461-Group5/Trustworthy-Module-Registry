/*
 * Author(s): Joe Dahms
 * Purpose: Check if a regular expression is a valid JavaScript regular expression. 
 */

export function isValidRegex (pattern: string): boolean {
  if (!pattern) {
    return false;
  }

  const MAX_REGEX_LENGTH = 100;
  if (pattern.length > MAX_REGEX_LENGTH) {
    return false;
  }

  try {
    const timeoutMs = 100; // 100ms timeout
    const startTime = Date.now();

    const testRegex = new RegExp(pattern);

    const testString = "test";
    testRegex.test(testString);

    const duration = Date.now() - startTime;
    if (duration > timeoutMs) {
      return false;
    }

    return true;
  }
 catch (error: unknown) {
    return false;
  }
}
