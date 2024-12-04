/*
 * Author(s): Joe Dahms
 * Purpose: Delete test packages from database after running a test.
 */

import { expect, describe, test, vi } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

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
