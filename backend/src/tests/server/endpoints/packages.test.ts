/*
 * Author(s): Joe Dahms
 * Purpose: Test the package endpoint.
 */
import { expect, describe, test } from "vitest";
import request from "supertest";
import app from "../../../server/server.js";

describe("packages endpoint", () => {
  // Correct key format
  test.each([
    {
      testName: "Valid Format",
      packages: [
        { Name: "name1", Version: "version1" },
        { Name: "name2", Version: "version2" },
      ],
      expectedStatus: 200,
      expectedBody: [
        { Name: "name1", Version: "version1", ID: "dummyid" },
        { Name: "name2", Version: "version2", ID: "dummyid" },
      ],
    },
    {
      testName: "Invalid key at index 0",
      packages: [
        { notName: "name1", Version: "version1" },
        { Name: "name2", Version: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Invalid version at index 0",
      packages: [
        { Name: "name1", notVersion: "version1" },
        { Name: "name2", Version: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Invalid key at index 1",
      packages: [
        { Name: "name1", Version: "version1" },
        { notName: "name2", Version: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Invalid version at index 1",
      packages: [
        { Name: "name1", Version: "version1" },
        { Name: "name2", notVersion: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: {},
    },
  ])("$testName", async ({ packages, expectedStatus, expectedBody }) => {
    const response = await request(app).post("/packages?offset=20").send(packages);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // Authentication

  // Package limit
  test.each([
    {
      testName: "1 under the package limit",
      packages: [{ Name: "name1", Version: "version1" }],
      expectedStatus: 200,
      expectedBody: [{ Name: "name1", Version: "version1", ID: "dummyid" }],
    },
    {
      testName: "At the package limit",
      packages: [
        { Name: "name1", Version: "version1" },
        { Name: "name2", Version: "version2" },
      ],
      expectedStatus: 200,
      expectedBody: [
        { Name: "name1", Version: "version1", ID: "dummyid" },
        { Name: "name2", Version: "version2", ID: "dummyid" },
      ],
    },
    {
      testName: "1 over the package limit",
      packages: [
        { Name: "name1", Version: "version1" },
        { Name: "name2", Version: "version2" },
        { Name: "name3", Version: "version3" },
      ],
      expectedStatus: 413,
      expectedBody: {},
    },
    {
      testName: "2 over the package limit",
      packages: [
        { Name: "name1", Version: "version1" },
        { Name: "name2", Version: "version2" },
        { Name: "name3", Version: "version3" },
        { Name: "name4", Version: "version4" },
      ],
      expectedStatus: 413,
      expectedBody: {},
    },
  ])("$testName", async ({ packages, expectedStatus, expectedBody }) => {
    const response = await request(app).post("/packages?offset=20").send(packages);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});