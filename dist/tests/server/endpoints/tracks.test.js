import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../../src/server/server.ts";
describe("tracks endpoint", () => {
    it("GET /tracks should say we aren't pursing any tracks", async () => {
        const res = await request(app).get("/tracks");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("plannedTracks", "[none]");
    });
});
//# sourceMappingURL=tracks.test.js.map