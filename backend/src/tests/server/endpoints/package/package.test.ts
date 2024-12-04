/*
 * Author(s): Joe Dahms
 * Purpose: Test the package endpoint.
 */

import { expect, describe, test, vi } from "vitest";
import request from "supertest";
import app from "../../../server/server.js";
import { dbUploadPackage } from "../../../database/controllers/package/upload.js";

describe("prisma test", () => {
  test.each([
    {
      testName: "standard package",
      mockPackage: {
        name: "noname",
        version: "noversion",
        id: undefined,
        content: Buffer.alloc(0),
        url: "http://test.com",
        debloat: true,
        jsProgram: "console.log(\"test\")",
      },
      inputPackage: {
        data: {
          Content: Buffer.alloc(0),
          URL: "http://test.com",
          debloat: true,
          JSProgram: "console.log(\"test\")",
        },
      },
    },
    {
      testName: "package with null debloat and JSProgram values",
      mockPackage: {
        name: "noname",
        version: "noversion",
        id: undefined,
        content: Buffer.alloc(0),
        url: "http://test.com",
        debloat: null,
        jsProgram: null,
      },
      inputPackage: {
        data: {
          Content: Buffer.alloc(0),
          URL: "http://test.com",
          debloat: null,
          JSProgram: null,
        },
      },
    },
  ])("$testName", async ({ mockPackage, inputPackage }) => {
    prismaMock.package.create.mockResolvedValue(mockPackage);

    const result = await dbUploadPackage(inputPackage);

    expect(result).toEqual({
      metadata: {
        Name: mockPackage.name,
        Version: mockPackage.version,
        ID: mockPackage.id,
      },
      data: {
        Content: mockPackage.content,
        URL: mockPackage.url,
        debloat: mockPackage.debloat,
        JSProgram: mockPackage.jsProgram,
      },
    });
  });
});
