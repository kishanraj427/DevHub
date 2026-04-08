import { beforeEach, describe, expect, test } from "vitest";
import { clearToken, getToken, setToken } from "@/lib/auth";

describe("auth token helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("getToken returns null when nothing stored", () => {
    expect(getToken()).toBeNull();
  });

  test("setToken stores token and getToken retrieves it", () => {
    setToken("abc123");
    expect(getToken()).toBe("abc123");
  });

  test("clearToken removes the stored token", () => {
    setToken("abc123");
    clearToken();
    expect(getToken()).toBeNull();
  });

  test("setToken overwrites an existing token", () => {
    setToken("first");
    setToken("second");
    expect(getToken()).toBe("second");
  });
});
