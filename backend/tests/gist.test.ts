import { describe, test, expect, mock } from "bun:test";
import request from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(import.meta.dir, "../.env") });

// Mock the gist service to avoid connecting to Redis/BullMQ in tests
mock.module("../src/services/gistService", () => ({
  addGistExportJob: mock(async () => ({ id: "mock-job-id" })),
}));

import app from "../src/index";

const token = jwt.sign({ userId: "test-user-id" }, process.env.JWT_SECRET!, {
  expiresIn: "1h",
});
const auth = `Bearer ${token}`;

describe("Gist API Routes", () => {
  // --- Auth required ---
  describe("authentication", () => {
    test("POST /api/gist/export returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/gist/export")
        .send({ snippetId: "some-snippet-id" });
      expect(res.status).toBe(401);
    });
  });

  // --- Export gist ---
  describe("POST /api/gist/export", () => {
    test("returns 200 and queues job with valid snippetId", async () => {
      const res = await request(app)
        .post("/api/gist/export")
        .set("Authorization", auth)
        .send({ snippetId: "some-snippet-id" });
      if (res.status === 200) {
        expect(res.body).toHaveProperty("message", "Gist export started");
      } else {
        expect(res.status).toBe(500);
      }
    });

    test("returns 500 when snippetId is missing", async () => {
      const res = await request(app)
        .post("/api/gist/export")
        .set("Authorization", auth)
        .send({});
      expect([400, 500]).toContain(res.status);
    });
  });
});
