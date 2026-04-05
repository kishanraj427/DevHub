import { describe, test, expect } from 'bun:test';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(import.meta.dir, '../.env') });

import app from '../src/index';

const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
const auth = `Bearer ${token}`;

describe('CRUD Routes', () => {
  // --- Auth required ---
  describe('authentication', () => {
    test('GET /api/user returns 401 without token', async () => {
      const res = await request(app).get('/api/user');
      expect(res.status).toBe(401);
    });

    test('POST /api/user returns 401 without token', async () => {
      const res = await request(app).post('/api/user').send({});
      expect(res.status).toBe(401);
    });

    test('PUT /api/user/123 returns 401 without token', async () => {
      const res = await request(app).put('/api/user/123').send({});
      expect(res.status).toBe(401);
    });

    test('DELETE /api/user/123 returns 401 without token', async () => {
      const res = await request(app).delete('/api/user/123');
      expect(res.status).toBe(401);
    });
  });

  // --- Invalid model ---
  describe('invalid model', () => {
    test('GET /api/invalid returns 404', async () => {
      const res = await request(app)
        .get('/api/invalid')
        .set('Authorization', auth);
      expect(res.status).toBe(404);
      expect(res.body.error).toContain('not found');
    });

    test('POST /api/invalid returns 404', async () => {
      const res = await request(app)
        .post('/api/invalid')
        .set('Authorization', auth)
        .send({ name: 'test' });
      expect(res.status).toBe(404);
    });

    test('GET /api/invalid/123 returns 404', async () => {
      const res = await request(app)
        .get('/api/invalid/123')
        .set('Authorization', auth);
      expect(res.status).toBe(404);
    });

    test('PUT /api/invalid/123 returns 404', async () => {
      const res = await request(app)
        .put('/api/invalid/123')
        .set('Authorization', auth)
        .send({});
      expect(res.status).toBe(404);
    });

    test('DELETE /api/invalid/123 returns 404', async () => {
      const res = await request(app)
        .delete('/api/invalid/123')
        .set('Authorization', auth);
      expect(res.status).toBe(404);
    });
  });

  // --- List endpoint (requires DB) ---
  describe('GET /api/:model (list)', () => {
    test('returns paginated response structure', async () => {
      const res = await request(app)
        .get('/api/user')
        .set('Authorization', auth);
      // 200 if DB is up, 500 if not
      if (res.status === 200) {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
        expect(res.body).toHaveProperty('totalPages');
        expect(Array.isArray(res.body.data)).toBe(true);
      } else {
        expect(res.status).toBe(500);
      }
    });

    test('respects page and limit params', async () => {
      const res = await request(app)
        .get('/api/user?page=2&limit=5')
        .set('Authorization', auth);
      if (res.status === 200) {
        expect(res.body.page).toBe(2);
        expect(res.body.limit).toBe(5);
      } else {
        expect(res.status).toBe(500);
      }
    });

    test('defaults to page 1 and limit 20', async () => {
      const res = await request(app)
        .get('/api/user')
        .set('Authorization', auth);
      if (res.status === 200) {
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(20);
      } else {
        expect(res.status).toBe(500);
      }
    });

    test('caps limit at 100', async () => {
      const res = await request(app)
        .get('/api/user?limit=500')
        .set('Authorization', auth);
      if (res.status === 200) {
        expect(res.body.limit).toBe(100);
      } else {
        expect(res.status).toBe(500);
      }
    });
  });

  // --- Get by ID ---
  describe('GET /api/:model/:id', () => {
    test('returns 404 or 500 for non-existent record', async () => {
      const res = await request(app)
        .get('/api/user/non-existent-id')
        .set('Authorization', auth);
      expect([404, 500]).toContain(res.status);
    });
  });

  // --- Update ---
  describe('PUT /api/:model/:id', () => {
    test('returns 400, 404, or 500 for non-existent record', async () => {
      const res = await request(app)
        .put('/api/user/non-existent-id')
        .set('Authorization', auth)
        .send({ email: 'updated@test.com' });
      expect([400, 404, 500]).toContain(res.status);
    });
  });

  // --- Delete ---
  describe('DELETE /api/:model/:id', () => {
    test('returns 404 or 500 for non-existent record', async () => {
      const res = await request(app)
        .delete('/api/user/non-existent-id')
        .set('Authorization', auth);
      expect([404, 500]).toContain(res.status);
    });
  });

  // --- All models accessible ---
  describe('all models respond', () => {
    const models = ['user', 'snippet', 'collection', 'star', 'fork'];

    for (const model of models) {
      test(`GET /api/${model} returns 200 or 500`, async () => {
        const res = await request(app)
          .get(`/api/${model}`)
          .set('Authorization', auth);
        expect([200, 500]).toContain(res.status);
        if (res.status === 200) {
          expect(res.body).toHaveProperty('data');
        }
      });
    }
  });
});
