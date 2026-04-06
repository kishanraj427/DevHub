import { describe, test, expect } from "bun:test";
import request from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(import.meta.dir, "../.env") });

import app from "../src/index";

const token = jwt.sign({ userId: "test-user-id" }, process.env.JWT_SECRET!, {
  expiresIn: "1h",
});
const auth = `Bearer ${token}`;

describe("Search API Routes", () => {
  // --- Auth required ---
  describe("authentication", () => {
    test("GET /api/search/snippets returns 401 without token", async () => {
      const res = await request(app).get("/api/search/snippets?q=hello");
      expect(res.status).toBe(401);
    });
  });

  // --- Validation ---
  describe("GET /api/search/snippets - validation", () => {
    test("returns 400 when q param is missing", async () => {
      const res = await request(app)
        .get("/api/search/snippets")
        .set("Authorization", auth);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 when q param is empty string", async () => {
      const res = await request(app)
        .get("/api/search/snippets?q=")
        .set("Authorization", auth);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // --- Search results ---
  describe("GET /api/search/snippets", () => {
    test("returns snippets array with valid token and query", async () => {
      const res = await request(app)
        .get("/api/search/snippets?q=example")
        .set("Authorization", auth);
      if (res.status === 200) {
        expect(res.body).toHaveProperty("snippets");
        expect(res.body).toHaveProperty("success", true);
        expect(Array.isArray(res.body.snippets)).toBe(true);
      } else {
        expect(res.status).toBe(500);
      }
    });

    test("returned snippets have correct shape including star count", async () => {
      const res = await request(app)
        .get("/api/search/snippets?q=test")
        .set("Authorization", auth);
      if (res.status === 200 && res.body.snippets.length > 0) {
        const snippet = res.body.snippets[0];
        expect(snippet).toHaveProperty("id");
        expect(snippet).toHaveProperty("title");
        expect(snippet).toHaveProperty("code");
        expect(snippet).toHaveProperty("language");
        expect(snippet).toHaveProperty("isPublic", true);
        expect(snippet).toHaveProperty("_count");
        expect(snippet._count).toHaveProperty("stars");
        expect(typeof snippet._count.stars).toBe("number");
      }
    });

    test("only returns public snippets", async () => {
      const res = await request(app)
        .get("/api/search/snippets?q=test")
        .set("Authorization", auth);
      if (res.status === 200) {
        for (const snippet of res.body.snippets) {
          expect(snippet.isPublic).toBe(true);
        }
      }
    });

    test("returns empty array for query with no matches", async () => {
      const res = await request(app)
        .get("/api/search/snippets?q=zzznomatchzzz")
        .set("Authorization", auth);
      if (res.status === 200) {
        expect(res.body.snippets).toEqual([]);
      } else {
        expect(res.status).toBe(500);
      }
    });
  });
});
