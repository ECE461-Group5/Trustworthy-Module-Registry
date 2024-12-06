/*
 * Author(s): Joe Dahms
 * Purpose: Test that checkValidId can actually check that an ID is valid.
 */

import logger from "../../../../../logger.js";
import { expect, describe, test } from "vitest";
import { checkValidId } from "../../../../server/controllers/checkValidId.ts";

describe("checkValidId()", () => {
  test.each([
    {
      testName: "Package ID not a number",
      packageID: "376dalsk",
      expectedResult: false,
    },
    {
      testName: "Package ID negative",
      packageID: "-12343121",
      expectedResult: false,
    },
    {
      testName: "Package ID one digit too short",
      packageID: "1234567",
      expectedResult: false,
    },
    {
      testName: "Package ID one digit too long",
      packageID: "123456789",
      expectedResult: false,
    },
  ])("$testName", ({ packageID, expectedResult }) => {
    const result = checkValidId(packageID);
    expect(result).toEqual(expectedResult);
  });
});
