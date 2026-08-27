import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("PWA contract", () => {
  const publicDir = resolve(process.cwd(), "client/public");

  it("exposes an installable manifest with the branded icons", () => {
    const manifest = JSON.parse(readFileSync(resolve(publicDir, "manifest.webmanifest"), "utf8"));
    expect(manifest.name).toBe("CyberDimension Academy");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }),
      expect.objectContaining({ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }),
    ]));
  });

  it("ships the service worker and both icon assets", () => {
    expect(existsSync(resolve(publicDir, "sw.js"))).toBe(true);
    expect(existsSync(resolve(publicDir, "icons/icon-192.png"))).toBe(true);
    expect(existsSync(resolve(publicDir, "icons/icon-512.png"))).toBe(true);
  });

  it("does not intercept media requests with the app-shell fallback", () => {
    const serviceWorker = readFileSync(resolve(publicDir, "sw.js"), "utf8");
    expect(serviceWorker).toContain('request.destination === "video"');
    expect(serviceWorker).toContain('request.destination === "audio"');
    expect(serviceWorker).toContain('url.pathname.startsWith("/manus-storage/")');
    expect(serviceWorker).toContain('url.pathname.startsWith("/video-media/")');
  });
});
