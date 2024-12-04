/*
 * Author(s): Joe Dahms
 * Purpose: Test the package endpoint.
 */
import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../server/server.js";

describe("tracks endpoint", () => {
  it("GET /tracks should say we aren't pursing any tracks", async () => {
    const res = await request(app).get("/tracks");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("plannedTracks", "[none]");
  });
});
