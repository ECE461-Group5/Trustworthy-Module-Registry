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


describe("GET /package/:id endpoint", () => {
  // Return package
  test.each([
    {
      testName: "Return the package",
      packageID: "00000000",
      expectedStatus: 200,
      expectedBody: 
      {
        "metadata": {
          "Name": "<string>",
          "Version": "<string>",
          "ID": "00000000"
        },
        "data": {
          "Content": "<string>",
          "URL": "<string>",
          "debloat": "<boolean>",
          "JSProgram": "<string>"
        }
      },
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    const response = await request(app)
      .get(`/package/${packageID}`);

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
      .get(`/package/${packageID}`);

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
      .get(`/package/${packageID}`);

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
      newVersion: 
      {
        "metadata": {
          "Name": "<string>",
          "Version": "<string>",
          "ID": "00000000"
        },
        "data": {
          "Content": "<string>",
          "URL": "<string>",
          "debloat": "<boolean>",
          "JSProgram": "<string>"
        }
      },
      expectedBody: {},
    },
  ])("$testName", async ({ newVersion, packageID, expectedStatus, expectedBody }) => {
    const response = await request(app)
      .put(`/package/${packageID}`)
      .send(newVersion);

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
      .get(`/package/${packageID}`);

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
      .get(`/package/${packageID}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);  
  });


});

describe("DELETE /package/:id endpoint", () => {
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
        "00000000": {
          "totalCost": 1.0
        },
      }
    },
    {
      testName: "With Dependency",
      packageID: "00000000",
      dependency: "?dependency=true",
      expectedStatus: 200,
      expectedBody: {
        "00000000": {
          "standaloneCost": 1.0,
          "totalCost": 1.0
        },
        "00000001": {
          "standaloneCost": 1.0,
          "totalCost": 1.0
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

