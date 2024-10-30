import { expect, describe, it } from 'vitest';
import request from 'supertest';
import app from '../../src/index.ts'

describe('API Routes', () => {
  it('GET / should return express + typescript server', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Express + TypeScript Server');
  });
});
