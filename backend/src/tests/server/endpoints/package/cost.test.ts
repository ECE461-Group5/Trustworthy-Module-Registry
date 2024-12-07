/**
 * @filename - cost.test.ts
 * @author(s) - Joe Dahms
 * @purpose - Test getting the cost of a package.
 */

import { expect, describe, test } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

describe("/package/:id/cost endpoint", () => {
  // Dependency
  test.each([
    {
      testName: "Without Dependency",
      packageID: "00000000",
      dependency: "?dependency=false",
      expectedStatus: 200,
      expectedBody: {
        "00000000": {
          standaloneCost: expect.any(Number),
          totalCost: expect.any(Number),
        },
      },
    },
    {
      testName: "With Dependency",
      packageID: "00000000",
      dependency: "?dependency=true",
      expectedStatus: 200,
      expectedBody: {
        "00000000": {
          standaloneCost: expect.any(Number),
          totalCost: expect.any(Number),
        },
        "00000001": {
          standaloneCost: expect.any(Number),
          totalCost: expect.any(Number),
        },
      },
    },
  ])("$testName", async ({ dependency, packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).get(`/package/${packageID}/cost${dependency}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
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
