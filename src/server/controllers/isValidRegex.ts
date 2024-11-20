/*
 * Author(s): Joe Dahms
 * Purpose: Check if a regular expression is a valid JavaScript regular expression.
*/

import { escapeRegExp } from "lodash";

export function isValidRegex (pattern: string): boolean {
  try {
    const safePattern = escapeRegExp(pattern);
    new RegExp(safePattern);
    return true;
  }
  catch (error: unknown) {
    return false;
  }
}
