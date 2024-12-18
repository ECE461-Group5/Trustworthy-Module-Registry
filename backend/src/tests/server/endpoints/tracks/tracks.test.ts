/**
 * @filename - tracks.test.ts
 * @author(s) - Joe Dahms
 * @purpose - Test the package endpoint.
 */
import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../../server/server.js";

describe("tracks endpoint", () => {
  it("GET /tracks should return the planned tracks", async () => {
    const res = await request(app).get("/tracks");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("plannedTracks", ["Access control track"]);
  });
});
