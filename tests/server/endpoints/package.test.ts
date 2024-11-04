import { expect, describe, it } from 'vitest';
import request from 'supertest';
import app from '../../../src/server/server.ts'

describe('/package endpoint', () => {
  it("POST /package is not implemented", async () => {
    const res = await request(app).post("/package");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: upload package");
  });
});

describe('/package/:id endpoint', () => {
  it("GET /package/:id is not implemented", async () => {
    const res = await request(app).get("/package/:id");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: get package");
  });

  it("PUT /package/:id is not implemented", async () => {
    const res = await request(app).put("/package/:id");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: update package");
  });

  it("POST /package/:id is is not a valid operation", async () => {
    const res = await request(app).put("/package/:id");
    expect(res.statusCode).toBe(404);
  });

  it("DELETE /package/:id is not implemented", async () => {
    const res = await request(app).delete("/package/:id");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: delete package");
  });
});

describe('/package/:id/rate endpoint', () => {
  it("GET /package/:id/rate is not implemented", async () => {
    const res = await request(app).get("/package/:id/rate");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: get package rating");
  });
});

describe('/package/:id/cost endpoint', () => {
  it("GET /package/:id/cost is not implemented", async () => {
    const res = await request(app).get("/package/:id/cost");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "NOT IMPLEMENTED: get package cost");
  });
});

