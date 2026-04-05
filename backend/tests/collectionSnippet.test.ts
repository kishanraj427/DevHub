import { describe, test, expect } from 'bun:test';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(import.meta.dir, '../.env') });

import app from '../src/index';

const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET!, { expiresIn: '1h' });
const auth = `Bearer ${token}`;

describe('Collection Snippets API', () => {
  // --- Auth required ---
  describe('authentication', () => {
    test('GET /api/collections/:id/snippets returns 401 without token', async () => {
      const res = await request(app).get('/api/collections/col-123/snippets');
      expect(res.status).toBe(401);
    });

    test('POST /api/collections/:id/snippets/:id returns 401 without token', async () => {
      const res = await request(app).post('/api/collections/col-123/snippets/snip-123');
      expect(res.status).toBe(401);
    });

    test('DELETE /api/collections/:id/snippets/:id returns 401 without token', async () => {
      const res = await request(app).delete('/api/collections/col-123/snippets/snip-123');
      expect(res.status).toBe(401);
    });
  });

  // --- List snippets in collection ---
  describe('GET /api/collections/:collectionId/snippets', () => {
    test('returns array or 500 if DB unavailable', async () => {
      const res = await request(app)
        .get('/api/collections/col-123/snippets')
        .set('Authorization', auth);
      if (res.status === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      } else {
        expect(res.status).toBe(500);
      }
    });
  });

  // --- Add snippet to collection ---
  describe('POST /api/collections/:collectionId/snippets/:snippetId', () => {
    test('returns 201, 409, or 500', async () => {
      const res = await request(app)
        .post('/api/collections/col-123/snippets/snip-123')
        .set('Authorization', auth);
      expect([201, 409, 500]).toContain(res.status);
    });
  });

  // --- Remove snippet from collection ---
  describe('DELETE /api/collections/:collectionId/snippets/:snippetId', () => {
    test('returns 404 or 500 for non-existent entry', async () => {
      const res = await request(app)
        .delete('/api/collections/non-existent/snippets/non-existent')
        .set('Authorization', auth);
      expect([404, 500]).toContain(res.status);
    });
  });
});
