/**
 * @filename - update.test.ts
 * @author(s) - Joe Dahms
 * @purpose - Test updating a package.
 */

import { expect, describe, test, vi } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

import { uploadContentPackage } from "../../../../database/testing/uploadTestPackage.ts";
import { deleteContentPackage } from "../../../../database/testing/deleteTestPackage.ts";

describe("PUT /package/:id endpoint", () => {
  // Successful update
  test("Update the package", async () => {
    const uploadedPackage = await uploadContentPackage();

    const updatedContent = "ASAAAAAAAAAAAAAAAAAAdDDDDDDDDDDDDDDDVVVVVVVVVVVVVVV";
    uploadedPackage.data.Content = updatedContent;

    const updateResponse = await request(app)
      .put(`/package/${uploadedPackage.metadata.ID}`)
      .send(uploadedPackage);

    expect(updateResponse.statusCode).toEqual(200);

    // Check that the Content actually got updated
    const getResponse = await request(app).get(`/package/${uploadedPackage.metadata.ID}`);
    expect(getResponse.statusCode).toEqual(200);

    console.log(Buffer.from(getResponse.body.data.Content.data).toString());

    if (
      typeof getResponse.body.data.Content === "object" &&
      getResponse.body.data.Content.type === "Buffer"
    ) {
      getResponse.body.data.Content = Buffer.from(getResponse.body.data.Content.data);
    }

    expect(getResponse.body.data.Content).toEqual(Buffer.from(updatedContent));

    await deleteContentPackage(uploadedPackage.metadata.ID);
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
    {
      testName: "Package ID not a number",
      packageID: "376dalsk",
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Package ID negative",
      packageID: "-12343121",
      expectedStatus: 400,
      expectedBody: {},
    },
  ])("$testName", async ({ packageID, expectedStatus, expectedBody }) => {
    const response = await request(app).put(`/package/${packageID}`);

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
      await deleteContentPackage(packageID);
    }
 catch (error) {
      logger.error(error);
    }

    const response = await request(app).put(`/package/${packageID}`);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });
});
