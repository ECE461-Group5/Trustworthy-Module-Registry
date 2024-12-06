/*
 * Author(s): Joe Dahms
 * Purpose: Test retrieving a package.
 */

import { expect, describe, test, vi } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";
import logger from "../../../../../logger.js";

import { uploadContentPackage } from "../../../../database/testing/uploadTestPackage.ts";
import { deleteContentPackage } from "../../../../database/testing/deleteTestPackage.ts";

describe("GET /package/:id endpoint", () => {
  // Success
  test("Package exists", async () => {
    const uploadedPackage = await uploadContentPackage();
    const response = await request(app).get(`/package/${uploadedPackage.metadata.ID}`);

    if (
      typeof response.body.data.Content === "object" &&
      response.body.data.Content.type === "Buffer"
    ) {
      response.body.data.Content = Buffer.from(response.body.data.Content.data);
    }

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      metadata: {
        Name: uploadedPackage.metadata.Name,
        Version: uploadedPackage.metadata.Version,
        ID: uploadedPackage.metadata.ID,
      },
      data: {
        Content: uploadedPackage.data.Content,
        URL: uploadedPackage.data.URL,
        debloat: uploadedPackage.data.debloat,
        JSProgram: uploadedPackage.data.JSProgram,
      },
    });

    const uploadedPackageId = Number(uploadedPackage.metadata.ID);
    await deleteContentPackage(uploadedPackageId);
  });

  // Package ID format
  test.each([
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
    const response = await request(app).get(`/package/${packageID}`);

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
