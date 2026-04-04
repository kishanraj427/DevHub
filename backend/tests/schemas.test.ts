import { describe, test, expect } from 'bun:test';
import {
  signupInputSchema,
  loginInputSchema,
  userSchema,
  baseSchema,
} from '@devhub/shared-schemas/schemas';

describe('signupInputSchema', () => {
  test('accepts valid signup data', () => {
    const result = signupInputSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  test('rejects invalid email', () => {
    const result = signupInputSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  test('rejects short password', () => {
    const result = signupInputSchema.safeParse({
      email: 'test@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });

  test('rejects missing fields', () => {
    expect(signupInputSchema.safeParse({}).success).toBe(false);
    expect(signupInputSchema.safeParse({ email: 'test@test.com' }).success).toBe(false);
    expect(signupInputSchema.safeParse({ password: 'password123' }).success).toBe(false);
  });
});

describe('loginInputSchema', () => {
  test('accepts valid login data', () => {
    const result = loginInputSchema.safeParse({
      email: 'test@example.com',
      password: 'any',
    });
    expect(result.success).toBe(true);
  });

  test('rejects invalid email', () => {
    const result = loginInputSchema.safeParse({
      email: 'bad',
      password: 'password',
    });
    expect(result.success).toBe(false);
  });
});

describe('baseSchema', () => {
  test('accepts valid base fields', () => {
    const result = baseSchema.safeParse({
      id: 'cuid123',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  test('accepts with deletedAt', () => {
    const result = baseSchema.safeParse({
      id: 'cuid123',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      deletedAt: '2026-01-02T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  test('accepts null deletedAt', () => {
    const result = baseSchema.safeParse({
      id: 'cuid123',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      deletedAt: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('userSchema', () => {
  test('accepts valid user', () => {
    const result = userSchema.safeParse({
      id: 'cuid123',
      email: 'test@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  test('accepts user with lastLoginAt', () => {
    const result = userSchema.safeParse({
      id: 'cuid123',
      email: 'test@example.com',
      lastLoginAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  test('strips password field', () => {
    const result = userSchema.safeParse({
      id: 'cuid123',
      email: 'test@example.com',
      password: 'should-be-stripped',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('password' in result.data).toBe(false);
    }
  });
});
