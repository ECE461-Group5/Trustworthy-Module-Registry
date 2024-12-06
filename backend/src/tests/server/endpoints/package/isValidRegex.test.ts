/**
 * @filename - isValidRegex.test.ts
 * @author(s) - Joe Dahms
 * @purpose - Test that isValidRegex can indentify harmful or incorrect regexes.
 */

import logger from "../../../../../logger.js";
import { expect, describe, test } from "vitest";
import { isValidRegex } from "../../../../server/controllers/isValidRegex.js";

describe("isValidRegex()", () => {
  test.each([
    {
      testName: "Invalid Regex",
      regex: "[",
      expectedResult: false,
    },
    {
      testName: "Too long",
      regex:
        "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
      expectedResult: false,
    },
  ])("$testName", ({ regex, expectedResult }) => {
    const result = isValidRegex(regex);
    expect(result).toEqual(expectedResult);
  });
});
