import { describe, expect, test } from "vitest";
import { computeStrength } from "@/components/auth/PasswordStrengthBar";

describe("computeStrength", () => {
  test("empty string scores 0", () => {
    expect(computeStrength("")).toBe(0);
  });

  test("length >= 6 scores 1", () => {
    expect(computeStrength("abcdef")).toBe(1);
  });

  test("length >= 10 scores 2", () => {
    expect(computeStrength("abcdefghij")).toBe(2);
  });

  test("mixed case adds 1", () => {
    expect(computeStrength("Abcdefghij")).toBe(3);
  });

  test("number or special char adds 1 for score 4", () => {
    expect(computeStrength("Abcdefghij1")).toBe(4);
    expect(computeStrength("Abcdefghij!")).toBe(4);
  });

  test("short password with number scores 0", () => {
    expect(computeStrength("Ab1")).toBe(0);
  });
});
