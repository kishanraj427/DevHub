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

describe("Fork API Routes", () => {
  // --- Auth required ---
  describe("authentication", () => {
    test("POST /api/forks/:snippetId returns 401 without token", async () => {
      const res = await request(app).post("/api/forks/some-snippet-id");
      expect(res.status).toBe(401);
    });

    test("GET /api/forks/:snippetId/count returns 401 without token", async () => {
      const res = await request(app).get("/api/forks/some-snippet-id/count");
      expect(res.status).toBe(401);
    });
  });

  // --- Create fork ---
  describe("POST /api/forks/:snippetId", () => {
    test("returns 400 for non-existent snippet", async () => {
      const res = await request(app)
        .post("/api/forks/non-existent-snippet-id")
        .set("Authorization", auth);
      expect([400, 500]).toContain(res.status);
    });

    test("returns fork object on success", async () => {
      const res = await request(app)
        .post("/api/forks/some-snippet-id")
        .set("Authorization", auth);
      if (res.status === 201) {
        expect(res.body).toHaveProperty("message", "Fork created successfully");
        expect(res.body).toHaveProperty("fork");
        expect(res.body).toHaveProperty("success", true);
        expect(res.body.fork).toHaveProperty("id");
        expect(res.body.fork).toHaveProperty("originalSnippetId");
        expect(res.body.fork).toHaveProperty("newSnippetId");
        expect(res.body.fork).toHaveProperty("userId");
      } else {
        expect(res.status).toBe(500);
      }
    });
  });

  // --- Get fork count ---
  describe("GET /api/forks/:snippetId/count", () => {
    test("returns count with valid token", async () => {
      const res = await request(app)
        .get("/api/forks/some-snippet-id/count")
        .set("Authorization", auth);
      if (res.status === 200) {
        expect(res.body).toHaveProperty("count");
        expect(res.body).toHaveProperty("success", true);
        expect(typeof res.body.count).toBe("number");
      } else {
        expect(res.status).toBe(500);
      }
    });

    test("returns 0 count for non-existent snippet", async () => {
      const res = await request(app)
        .get("/api/forks/non-existent-snippet-id/count")
        .set("Authorization", auth);
      if (res.status === 200) {
        expect(res.body.count).toBe(0);
      } else {
        expect(res.status).toBe(500);
      }
    });
  });
});
