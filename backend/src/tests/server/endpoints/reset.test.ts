/*
 * Author(s): Joe Dahms
 * Purpose: Test the package endpoint.
 */
import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../server/server.js";

describe("reset endpoint", () => {
  it("Reset the registry", async () => {
    const res = await request(app).delete("/reset");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });
});