import { expect, describe, it } from "vitest";
import request from "supertest";
import app from "../../backend/server/server.js";

describe("Root endpoint", () => {
  it("GET / should return Express + TypeScript Server", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Express + TypeScript Server");
  });
});