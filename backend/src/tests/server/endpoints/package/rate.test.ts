/**
 * @filename - rate.test.ts
 * @author(s) - Joe Dahms
 * @purpose - Test getting the ratings of a package.
 */

import { expect, describe, test, vi } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

describe("/package/:id/rate endpoint", () => {
  // Rating format
  test.each([
    {
      testName: "correctly formatted rating",
      packageID: "00000000",
      expectedStatus: 200,
      expectedBody: {
          id: 0,
          packageId: 0,
          rampUp: 0.5,
          correctness: 0.8,
          busFactor: 1.0,
          responsiveMaintainer: 0.9,
          licenseScore: 0.7,
          goodPinningPractice: 0.6,
          pullRequest: 0.95,
          netScore: 0.85,
          rampUpLatency: 123.45,
          correctnessLatency: 234.56,
          busFactorLatency: 345.67,
          responsiveMaintainerLatency: 456.78,
          licenseScoreLatency: 567.89,
          goodPinningPracticeLatency: 678.90,
          pullRequestLatency: 789.01,
          netScoreLatency: 890.12,       
      },
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).get(`/package/${packageID}/rate`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
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
    const response = await request(app).get(`/package/${packageID}/rate`);

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
    const response = await request(app).get(`/package/${packageID}/rate`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // Package rating system choked on at least one of the metrics
});
