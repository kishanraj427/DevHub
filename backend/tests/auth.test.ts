import { describe, test, expect } from 'bun:test';
import jwt from 'jsonwebtoken';
import { authenticate } from '../src/middleware/auth';

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

const mockRes = () => {
  let statusCode = 200;
  let body: unknown;
  return {
    status(code: number) { statusCode = code; return this; },
    json(data: unknown) { body = data; return this; },
    getStatus: () => statusCode,
    getBody: () => body,
  };
};

describe('authenticate middleware', () => {
  test('returns 401 when no authorization header', () => {
    const req = { headers: {} } as any;
    const res = mockRes();
    let nextCalled = false;

    authenticate(req, res as any, () => { nextCalled = true; });

    expect(res.getStatus()).toBe(401);
    expect(res.getBody()).toEqual({ error: 'No token provided' });
    expect(nextCalled).toBe(false);
  });

  test('returns 401 when header does not start with Bearer', () => {
    const req = { headers: { authorization: 'Basic abc123' } } as any;
    const res = mockRes();
    let nextCalled = false;

    authenticate(req, res as any, () => { nextCalled = true; });

    expect(res.getStatus()).toBe(401);
    expect(nextCalled).toBe(false);
  });

  test('returns 401 with invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as any;
    const res = mockRes();
    let nextCalled = false;

    authenticate(req, res as any, () => { nextCalled = true; });

    expect(res.getStatus()).toBe(401);
    expect(res.getBody()).toEqual({ error: 'Invalid token' });
    expect(nextCalled).toBe(false);
  });

  test('calls next and sets userId with valid token', () => {
    const token = jwt.sign({ userId: 'user-123' }, JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = mockRes();
    let nextCalled = false;

    authenticate(req, res as any, () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
    expect(req.userId).toBe('user-123');
  });

  test('returns 401 with expired token', () => {
    const token = jwt.sign({ userId: 'user-123' }, JWT_SECRET, { expiresIn: '0s' });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = mockRes();
    let nextCalled = false;

    // small delay to ensure token is expired
    setTimeout(() => {
      authenticate(req, res as any, () => { nextCalled = true; });
      expect(res.getStatus()).toBe(401);
      expect(nextCalled).toBe(false);
    }, 10);
  });
});
