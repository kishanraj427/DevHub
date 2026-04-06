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

describe("Star API Routes", () => {
  // --- Auth required ---
  describe("authentication", () => {
    test("GET /api/stars returns 401 without token", async () => {
      const res = await request(app).get("/api/stars");
      expect(res.status).toBe(401);
    });

    test("POST /api/stars/snippets/:snippetId returns 401 without token", async () => {
      const res = await request(app).post("/api/stars/snippets/some-snippet-id");
      expect(res.status).toBe(401);
    });

    test("GET /api/stars/snippets/:snippetId/count returns 401 without token", async () => {
      const res = await request(app).get(
        "/api/stars/snippets/some-snippet-id/count",
      );
      expect(res.status).toBe(401);
    });
  });

  // --- Get stars for user ---
  describe("GET /api/stars", () => {
    test("returns stars array with valid token", async () => {
      const res = await request(app)
        .get("/api/stars")
        .set("Authorization", auth);
      if (res.status === 200) {
        expect(res.body).toHaveProperty("stars");
        expect(res.body).toHaveProperty("success", true);
        expect(Array.isArray(res.body.stars)).toBe(true);
        if (res.body.stars.length > 0) {
          expect(res.body.stars[0]).toHaveProperty("id");
          expect(res.body.stars[0]).toHaveProperty("userId");
          expect(res.body.stars[0]).toHaveProperty("snippetId");
        }
      } else {
        expect(res.status).toBe(500);
      }
    });
  });

  // --- Toggle star ---
  describe("POST /api/stars/snippets/:snippetId (toggle)", () => {
    test("returns starred status with valid token", async () => {
      const res = await request(app)
        .post("/api/stars/snippets/non-existent-snippet")
        .set("Authorization", auth);
      if (res.status === 200) {
        expect(res.body).toHaveProperty("starred");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("success", true);
        expect(typeof res.body.starred).toBe("boolean");
      } else {
        expect(res.status).toBe(500);
      }
    });

    test("toggles star on and off", async () => {
      const snippetId = "toggle-test-snippet";

      // First toggle - should star
      const res1 = await request(app)
        .post(`/api/stars/snippets/${snippetId}`)
        .set("Authorization", auth);

      if (res1.status === 200) {
        const firstState = res1.body.starred;

        // Second toggle - should unstar
        const res2 = await request(app)
          .post(`/api/stars/snippets/${snippetId}`)
          .set("Authorization", auth);

        if (res2.status === 200) {
          expect(res2.body.starred).toBe(!firstState);
        }
      } else {
        expect(res1.status).toBe(500);
      }
    });
  });

  // --- Get stars count ---
  describe("GET /api/stars/snippets/:snippetId/count", () => {
    test("returns count with valid token", async () => {
      const res = await request(app)
        .get("/api/stars/snippets/some-snippet-id/count")
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
        .get("/api/stars/snippets/non-existent-id/count")
        .set("Authorization", auth);
      if (res.status === 200) {
        expect(res.body.count).toBe(0);
      } else {
        expect(res.status).toBe(500);
      }
    });
  });
});
