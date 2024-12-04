/*
 * Author(s): Joe Dahms
 * Purpose: Delete test packages from database after running a test.
 */

import { expect, describe, test, vi } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

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
        Content: Buffer.from("sadfashjklfgasdkjhfgjkd", "base64"),
        debloat: true,
        JSProgram: "<string>",
      },
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Missing debloat",
      packageData: {
        Content: Buffer.from("sadfashjklfgasdkjhfgjkd", "base64"),
        URL: "<string>",
        JSProgram: "<string>",
      },
      expectedStatus: 400,
      expectedBody: {},
    },
    {
      testName: "Missing JSProgram",
      packageData: {
        Content: Buffer.from("sadfashjklfgasdkjhfgjkd", "base64"),
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
        Content: "AAAAAAAAAAAAAAAAAAAAAAAAA",
        URL: "<string>",
        debloat: true,
        JSProgram: "<string>",
      },
      mockPackage: {
        name: "noname",
        version: "noversion",
        id: undefined,
        content: Buffer.alloc(0),
        url: "http://test.com",
        debloat: null,
        jsProgram: null,
      },

      expectedStatus: 400,
      expectedBody: {},
    },
    /*
    {
      testName: "Only Content set",
      packageData: {
        Content: "AAAAAAAAAAAAAAAAAAAAAAAAaaa",
        URL: "",
        debloat: true,
        JSProgram: "<string>",
      },
      mockPackage: {
        name: "noname",
        version: "noversion",
        id: undefined,
        content: Buffer.alloc(0),
        url: "http://test.com",
        debloat: null,
        jsProgram: null,
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
      mockPackage: {
        name: "noname",
        version: "noversion",
        id: undefined,
        content: Buffer.alloc(0),
        url: "http://test.com",
        debloat: null,
        jsProgram: null,
      },

      expectedStatus: 200,
      expectedBody: {},
    },
    */
  ])("$testName", async ({ packageData, mockPackage, expectedStatus, expectedBody }) => {
    prismaMock.package.create.mockResolvedValue(mockPackage);
    const response = await request(app).post("/package").send(packageData);

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  // Test for only content of url set
  // Package already exists
  // Package is not uploaded due to dq rating
});
