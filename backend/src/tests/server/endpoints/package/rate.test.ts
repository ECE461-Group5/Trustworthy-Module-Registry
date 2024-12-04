/*
 * Author(s): Joe Dahms
 * Purpose: Test getting the ratings of a package.
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
        RampUp: "<double>",
        Correctness: "<double>",
        BusFactor: "<double>",
        ResponsiveMaintainer: "<double>",
        LicenseScore: "<double>",
        GoodPinningPractice: "<double>",
        PullRequest: "<double>",
        NetScore: "<double>",
        RampUpLatency: "<double>",
        CorrectnessLatency: "<double>",
        BusFactorLatency: "<double>",
        ResponsiveMaintainerLatency: "<double>",
        LicenseScoreLatency: "<double>",
        GoodPinningPracticeLatency: "<double>",
        PullRequestLatency: "<double>",
        NetScoreLatency: "<double>",
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
