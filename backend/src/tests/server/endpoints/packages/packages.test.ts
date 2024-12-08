/**
 * @filename - packages.test.ts
 * @author(s) - Joe Dahms
 * @purpose - Test the package endpoint.
 */
import { expect, describe, test } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";
import { PackageResponse } from "../../../../server/controllers/package.js";
import { uploadURLPackage } from "../../../../database/testing/uploadTestPackage.js";

describe("packages endpoint", () => {
  // Correct key format
  test.each([
    {
      testName: "Valid Format with Unknown Entries",
      packages: [{ Name: "*", Version: "*" }],
      expectedStatus: 200,
      validateBody: (body: { limit: number; offset: number; packages: PackageResponse[]; total: number }): void => {
        // Ensure the body has the expected metadata keys
        expect(body).toHaveProperty("limit");
        expect(body).toHaveProperty("offset");
        expect(body).toHaveProperty("total");
        expect(body).toHaveProperty("packages");

        // Ensure `packages` is an array
        expect(Array.isArray(body.packages)).toBe(true);

        // Validate each package in the `packages` array
        body.packages.forEach((pkg) => {
          expect(pkg).toHaveProperty("ID");
          expect(pkg).toHaveProperty("Name");
          expect(pkg).toHaveProperty("Version");
        });

        // Optionally check that the `packages` array is not empty
        expect(body.packages.length).toBeGreaterThan(0);
      },
    },
  ])("$testName", async ({ packages, expectedStatus }): Promise<void> => {
    const uploadedPackage = await uploadURLPackage();
    const response = await request(app).post("/packages?offset=0").send(packages);
    await request(app).delete(`/package/${uploadedPackage.metadata.ID}`);
    // Validate the status code
    expect(response.statusCode).toEqual(expectedStatus);

    // Validate the structure of the response body
    expect(response.body).toEqual(
      expect.objectContaining({
        limit: expect.any(Number), // Ensure `limit` is a number
        offset: expect.any(Number), // Ensure `offset` is a number
        total: expect.any(Number), // Ensure `total` is a number
        packages: expect.arrayContaining([
          expect.objectContaining({
            ID: expect.any(String), // Each package must have an `ID` that is a string
            Name: expect.any(String), // Each package must have a `Name` that is a string
            Version: expect.any(String), // Each package must have a `Version` that is a string
          }),
        ]),
      })
    );
  });

  test.each([
    {
      testName: "Invalid key at index 0",
      packages: [
        { notName: "name1", Version: "version1" },
        { Name: "name2", Version: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: { error: "Invalid package format: missing Name or Version" },
    },
    {
      testName: "Invalid version at index 0",
      packages: [
        { Name: "name1", notVersion: "version1" },
        { Name: "name2", Version: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: { error: "Invalid package format: missing Name or Version" },
    },
    {
      testName: "Invalid key at index 1",
      packages: [
        { Name: "name1", Version: "version1" },
        { notName: "name2", Version: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: { error: "Invalid package format: missing Name or Version" },
    },
    {
      testName: "Invalid version at index 1",
      packages: [
        { Name: "name1", Version: "version1" },
        { Name: "name2", notVersion: "version2" },
      ],
      expectedStatus: 400,
      expectedBody: { error: "Invalid package format: missing Name or Version" },
    },
  ])("$testName", async ({ packages, expectedStatus, expectedBody }): Promise<void> => {
    const response = await request(app).post("/packages?offset=0").send(packages);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});
