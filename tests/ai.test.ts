import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

// ── vi.mock must appear BEFORE any imports that load the mocked module ────────
// connectDB is replaced entirely so no real MongoDB connection is attempted.
// The path must match the specifier used in src/app.ts.
vi.mock("../src/config/db", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

// Mock mongoose so the connection check in the /api/health route doesn't hang.
vi.mock("mongoose", async (importOriginal) => {
  const actual = await importOriginal<typeof import("mongoose")>();
  return {
    ...actual,
    default: {
      ...actual.default,
      connection: { readyState: 1 },
    },
  };
});

// Import app AFTER the mocks so Express never calls the real connectDB.
import { app } from "../src/app";

// ── Route test: POST /api/ai ──────────────────────────────────────────────────
// Requirement:
//   • 401 with no token
//   • A valid token gets past requireAuth
//
// POST /api/ai sits behind requireAuth (src/routes/ai.ts).
// We test the auth layer only — we do NOT call Gemini.
// ─────────────────────────────────────────────────────────────────────────────

const TEST_SECRET = "test-jwt-secret-for-gt6";

function makeToken(userId = "test-user-id"): string {
  return jwt.sign({ userId }, TEST_SECRET, { expiresIn: "1h" });
}

beforeAll(() => {
  // Set a known secret so the tokens we mint above pass jwt.verify().
  process.env.JWT_SECRET = TEST_SECRET;
  // Prevent the Gemini client from throwing "GEMINI_API_KEY is missing" as an
  // unhandled rejection before we can assert on the status code.
  process.env.GEMINI_API_KEY = "test-key-not-used";
});

describe("POST /api/ai — requireAuth guard", () => {
  it("returns 401 when no Authorization header is sent", async () => {
    const res = await request(app).post("/api/ai").send({ prompt: "test" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  }, 10_000);

  it("returns 401 when the token is malformed", async () => {
    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", "Bearer not.a.real.token")
      .send({ prompt: "test" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  }, 10_000);

  it("gets past requireAuth with a valid token (status is not 401)", async () => {
    // Past auth the route calls Gemini (fake key → AiReplyError → 502)
    // or hits the Gemini API error path.  Either way: not 401.
    const token = makeToken();

    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${token}`)
      .send({
        prompt: "This is a valid prompt that is definitely longer than 20 characters.",
      });

    expect(res.status).not.toBe(401);
  }, 15_000);
});
