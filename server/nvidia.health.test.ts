import { describe, expect, it } from "vitest";

describe("NVIDIA NIM credentials", () => {
  it("authenticates against the official models endpoint when NVIDIA_API_KEY is configured", async () => {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error("NVIDIA_API_KEY is required for the NVIDIA integration health-check");
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.status, "NVIDIA API key must authenticate successfully").toBe(200);
    const payload = (await response.json()) as { data?: unknown };
    expect(Array.isArray(payload.data)).toBe(true);
  }, 30_000);
});
