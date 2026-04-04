import { describe, test, expect } from 'bun:test';
import { z } from 'zod';
import express, { type Request, type Response } from 'express';
import request from 'supertest';
import { validate } from '../src/middleware/validate';

const createTestApp = (schema: z.ZodType) => {
  const app = express();
  app.use(express.json());
  app.post('/test', validate(schema), (_req: Request, res: Response) => {
    res.json({ ok: true });
  });
  return app;
};

describe('validate middleware', () => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  test('passes with valid body', async () => {
    const app = createTestApp(schema);
    const res = await request(app)
      .post('/test')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test('returns 400 with invalid body', async () => {
    const app = createTestApp(schema);
    const res = await request(app)
      .post('/test')
      .send({ email: 'not-an-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toBeDefined();
  });

  test('returns 400 with empty body', async () => {
    const app = createTestApp(schema);
    const res = await request(app)
      .post('/test')
      .send({});

    expect(res.status).toBe(400);
  });
});
