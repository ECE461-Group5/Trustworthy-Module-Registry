/**
 * @filename - delete.test.ts
 * @author(s) - Joe Dahms
 * @purpose - Test deleting a package from the package registry.
 */

import logger from "../../../../../logger.js";
import { expect, describe, test } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

import { uploadContentPackage } from "../../../../database/testing/uploadTestPackage.ts";
import { deleteContentPackage } from "../../../../database/testing/deleteTestPackage.ts"; // Not currently used

describe("DELETE /package/:id endpoint", () => {
  // Package exists
  test("Delete the package", async () => {
    const uploadedPackage = await uploadContentPackage();
    const response = await request(app).delete(`/package/${uploadedPackage.metadata.ID}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({});
  });

  // ID format
  test.each([
    {
      testName: "Package ID not a number",
      packageID: "376dalsk",
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Package ID negative",
      packageID: "-12343121",
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Package ID one digit too short",
      packageID: "1234567",
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Package ID one digit too long",
      packageID: "123456789",
      expectedStatus: 400,
      expectedBody: {},
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).delete(`/package/${packageID}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // Authentication

  // Package does not exist
  test.each([
    {
      testName: "Package does not exist",
      packageID: "99999999",
      expectedStatus: 404,
      expectedBody: {},
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    // Ensure that the package does not exist and just log the error to "ignore" it
    try {
      await deleteContentPackage(99999999);
    }
 catch (error) {
      logger.error(error);
    }
    const response = await request(app).delete(`/package/${packageID}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});
