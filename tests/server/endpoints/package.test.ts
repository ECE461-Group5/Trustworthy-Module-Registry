import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../src/server/server.ts";

describe("/package endpoint", () => {
  it("POST /package is not implemented", async () => {
    const res = await request(app).post("/package");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: upload package");
  });
});


describe("/package/:id endpoint", () => {
  it("GET /package/:id is not implemented", async () => {
    const res = await request(app).get("/package/:id");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: get package");
  });

  it("PUT /package/:id is not implemented", async () => {
    const res = await request(app).put("/package/:id");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: update package");
  });

  it("DELETE /package/:id is not implemented", async () => {
    const res = await request(app).delete("/package/:id");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: delete package");
  });
});


describe("/package/:id/rate endpoint", () => {
   // Rating format
  test.each([
    {
      testName: "correctly formatted rating",
      packageID: "00000000",
      expectedStatus: 200,
      expectedBody:
      {
        "RampUp": "<double>",
        "Correctness": "<double>",
        "BusFactor": "<double>",
        "ResponsiveMaintainer": "<double>",
        "LicenseScore": "<double>",
        "GoodPinningPractice": "<double>",
        "PullRequest": "<double>",
        "NetScore": "<double>",
        "RampUpLatency": "<double>",
        "CorrectnessLatency": "<double>",
        "BusFactorLatency": "<double>",
        "ResponsiveMaintainerLatency": "<double>",
        "LicenseScoreLatency": "<double>",
        "GoodPinningPracticeLatency": "<double>",
        "PullRequestLatency": "<double>",
        "NetScoreLatency": "<double>",
      },
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    const response = await request(app)
      .get(`/package/${packageID}/rate`);

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
    const response = await request(app)
      .get(`/package/${packageID}/rate`);

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
    const response = await request(app)
      .get(`/package/${packageID}/rate`);

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
        "357898765": {
          "totalCost": 95.0
        },
      }
    },
    {
      testName: "With Dependency",
      packageID: "00000000",
      dependency: "?dependency=true",
      expectedStatus: 200,
      expectedBody: {
        "357898765": {
          "standaloneCost": 50.0,
          "totalCost": 95.0
        },
        "988645763": {
          "standaloneCost": 20.0,
          "totalCost": 45.0
        }
      }
    },
  ])("$testName", async ({ dependency, packageID, expectedStatus, expectedBody }) => {
    const response = await request(app)
      .get(`/package/${packageID}/cost${dependency}`);

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
    const response = await request(app)
      .get(`/package/${packageID}/cost${dependency}`);

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
    const response = await request(app)
      .get(`/package/${packageID}/rate`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);  
  });
 
  // Rating system choked on metric

});


describe("/package/byRegEx endpoint", () => {
  it("POST /package/byRegEx is not implemented", async () => {
    const res = await request(app).post("/package/byRegEx");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: get package by regex");
  });
});

