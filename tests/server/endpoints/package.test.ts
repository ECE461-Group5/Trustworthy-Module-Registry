/*
 * Author(s): Joe Dahms
 * Purpose: Test the package endpoint.
 */

import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../src/server/server.ts";

describe("/package endpoint", () => {
  // Missing fields in package data
  test.each([
    {
      testName: "Missing Content",
      packageData: {
        URL: "<string>",
        debloat: true,
        JSProgram: "<string>",
      },
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Missing URL",
      packageData: {
        Content: "string",
        debloat: true,
        JSProgram: "<string>",
      },
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Missing debloat",
      packageData: {
        Content: "string",
        URL: "<string>",
        JSProgram: "<string>",
      },
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Missing JSProgram",
      packageData: {
        Content: "string",
        URL: "<string>",
        debloat: true,
      },
      expectedStatus: 400,
      expectedBody: {},
    },
  ])("$testName", async ({ packageData, expectedStatus, expectedBody }) => {
    const response = await request(app).post("/package").send(packageData);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  test.each([
    {
      testName: "Both Content and URL set",
      packageData: {
        Content: "<string>",
        URL: "<string>",
        debloat: true,
        JSProgram: "<string>",
      },
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Only Content set",
      packageData: {
        Content: "<string>",
        URL: "",
        debloat: true,
        JSProgram: "<string>",
      },
      expectedStatus: 200,
      expectedBody: {},
    },
    {
      testName: "Only URL set",
      packageData: {
        Content: "",
        URL: "<string>",
        debloat: true,
        JSProgram: "<string>",
      },
      expectedStatus: 200,
      expectedBody: {},
    },
  ])("$testName", async ({ packageData, expectedStatus, expectedBody }) => {
    const response = await request(app).post("/package").send(packageData);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // Test for only content of url set
  // Package already exists
  // Package is not uploaded due to dq rating
});

describe("GET /package/:id endpoint", () => {
  // Return package
  test.each([
    {
      testName: "Return the package",
      packageID: "00000000",
      expectedStatus: 200,
      expectedBody: {
        metadata: {
          Name: "<string>",
          Version: "<string>",
          ID: "00000000",
        },
        data: {
          Content: "<string>",
          URL: "<string>",
          debloat: "<boolean>",
          JSProgram: "<string>",
        },
      },
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).get(`/package/${packageID}`);

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
    const response = await request(app).get(`/package/${packageID}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});

describe("PUT /package/:id endpoint", () => {
  // Update package
  test.each([
    {
      testName: "update the package",
      packageID: "00000000",
      expectedStatus: 200,
      newVersion: {
        metadata: {
          Name: "<string>",
          Version: "<string>",
          ID: "00000000",
        },
        data: {
          Content: "<string>",
          URL: "<string>",
          debloat: "<boolean>",
          JSProgram: "<string>",
        },
      },
      expectedBody: {},
    },
  ])("$testName", async ({ newVersion, packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).put(`/package/${packageID}`).send(newVersion);

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
    const response = await request(app).get(`/package/${packageID}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});

describe("DELETE /package/:id endpoint", () => {
  // Delete package
  test.each([
    {
      testName: "delete the package",
      packageID: "00000000",
      expectedStatus: 200,
      expectedBody: {},
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).delete(`/package/${packageID}`);

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
    const response = await request(app).delete(`/package/${packageID}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});

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
          totalCost: 1.0,
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
          standaloneCost: 1.0,
          totalCost: 1.0,
        },
        "00000001": {
          standaloneCost: 1.0,
          totalCost: 1.0,
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
    const response = await request(app).get(`/package/${packageID}/rate`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // Rating system choked on metric
});

describe("/package/byRegEx endpoint", () => {
  // RegEx key
  test.each([
    {
      testName: "regex",
      expectedStatus: 400,
      regex: {
        regex: "regexhere",
      },
      expectedBody: {},
    },
    {
      testName: "REGEX",
      expectedStatus: 400,
      regex: {
        REGEX: "regexhere",
      },
      expectedBody: {},
    },
    {
      testName: "notevenclosetoRegEx",
      expectedStatus: 400,
      regex: {
        notevenclosetoRegEx: "regexhere",
      },
      expectedBody: {},
    },
    {
      testName: "RegExatthebeginning",
      expectedStatus: 400,
      regex: {
        RegExatthebeginning: "regexhere",
      },
      expectedBody: {},
    },
    {
      testName: "itsinRegExthemiddle",
      expectedStatus: 400,
      regex: {
        itsinRegExthemiddle: "regexhere",
      },
      expectedBody: {},
    },
  ])("$testName", async ({ regex, expectedStatus, expectedBody }) => {
    const response = await request(app).post("/package/byRegEx").send(regex);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // RegEx valididty
  test.each([
    {
      testName: "valid regex",
      expectedStatus: 200,
      regex: {
        RegEx: "/hello/",
      },
      expectedBody: [
        {
          Name: "<string>",
          Version: "<string>",
          ID: "Ozc",
        },
        {
          Name: "<string>",
          Version: "<string>",
          ID: "7Dkbwno5XdR",
        },
      ],
    },
    {
      testName: "invalid regex: /hello(world/",
      expectedStatus: 400,
      regex: {
        RegEx: "/hello(world/",
      },
      expectedBody: {},
    },
    {
      testName: "invalid regex: /1+*/",
      expectedStatus: 400,
      regex: {
        RegEx: "/1+*/",
      },
      expectedBody: {},
    },
    {
      testName: "invalid regex: /[z-a]/",
      expectedStatus: 400,
      regex: {
        RegEx: "/[z-a]/",
      },
      expectedBody: {},
    },
    {
      testName: "invalid regex: /[a-z/",
      expectedStatus: 400,
      regex: {
        RegEx: "/[a-z/",
      },
      expectedBody: {},
    },
  ])("$testName", async ({ regex, expectedStatus, expectedBody }) => {
    const response = await request(app).post("/package/byRegEx").send(regex);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});
