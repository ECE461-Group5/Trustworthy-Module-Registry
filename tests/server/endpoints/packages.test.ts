import { expect, describe, it } from 'vitest';
import request from 'supertest';
import app from '../../../src/server/server.ts'

describe('packages endpoint', () => {
  it("GET /packages?offset=20 should return 404", async () => {
    const res = await request(app).get("/packages?offset=20");
    expect(res.statusCode).toBe(404);
  })

  it("POST /packages?offset=20 should say not implemented and the offset", async () => {
    const res = await request(app).post("/packages?offset=20");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: get packages");
    expect(res.body).toHaveProperty("offset", "20");
  });
});
