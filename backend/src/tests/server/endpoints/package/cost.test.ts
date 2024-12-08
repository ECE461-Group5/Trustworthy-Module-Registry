/**
 * @filename - cost.test.ts
 * @author(s) - Joe Dahms, Logan Pelkey
 * @purpose - Test getting the cost of a package.
 */

import { expect, describe, test } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

import { uploadURLPackage } from "../../../../database/testing/uploadTestPackage.js";
import { PackageCost } from "../../../../database/controllers/package/cost.js";
type ResponseBody = Record<string, PackageCost>;

describe("/package/:id/cost endpoint", () => {
  // Dependency
  test.each([
    {
      testName: "Without Dependency",
      dependency: "?dependency=false",
      expectedStatus: 200,
      validateResponseBody: (body: ResponseBody): void => {
        Object.entries(body).forEach(([key, value]) => {
          expect(key).toMatch(/^\d{8}$/); // Key must be an 8-digit string
          expect(value).toEqual({
            standaloneCost: expect.any(Number),
            totalCost: expect.any(Number),
          });
        });
      },
    },
    {
      testName: "With Dependency",
      dependency: "?dependency=true",
      expectedStatus: 200,
      validateResponseBody: (body: ResponseBody): void => {
        Object.entries(body).forEach(([key, value]) => {
          expect(key).toMatch(/^\d{8}$/); // Key must be an 8-digit string
          expect(value).toEqual({
            standaloneCost: expect.any(Number),
            totalCost: expect.any(Number),
          });
        });
      },
    },
  ])("$testName", async ({ dependency, expectedStatus, validateResponseBody }) => {
    const uploadedPackage = await uploadURLPackage();
    const uploadedID = String(uploadedPackage.metadata.ID);

    const response = await request(app).get(`/package/${uploadedID}/cost${dependency}`);

    expect(response.statusCode).toEqual(expectedStatus);

    // Validate response body using the dynamic validator
    validateResponseBody(response.body);

    await request(app).delete(`/package/${uploadedID}`);
  });

  // Package ID format
  test.each([
    {
      testName: "Package ID one digit too short",
      packageID: "1234567",
      dependency: "?dependency=false",
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Package ID one digit too long",
      packageID: "123456789",
      dependency: "?dependency=false",
      expectedStatus: 400,
      expectedBody: {},
    },
  ])("$testName", async ({ dependency, packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).get(`/package/${packageID}/cost${dependency}`);

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
    const response = await request(app).get(`/package/${packageID}/cost`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // Rating system choked on metric
});
