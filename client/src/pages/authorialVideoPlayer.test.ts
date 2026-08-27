import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("authorial video player", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/FormationStudy.tsx"), "utf8");

  it("persists local position and completion by course", () => {
    expect(source).toContain("cyberdimension-authorial-video-progress:");
    expect(source).toContain("window.localStorage.setItem(authorialVideoProgressKey(courseSlug)");
    expect(source).toContain("completed: completed");
    expect(source).toContain("Marcar concluída");
  });

  it("exposes modern playback speeds and interactive lesson navigation", () => {
    expect(source).toContain("[0.75, 1, 1.25, 1.5, 2]");
    expect(source).toContain("handleAuthorialVideoSelect(index)");
    expect(source).toContain("authorialVideoPanelRef.current?.scrollIntoView");
    expect(source).toContain('aria-label="Navegação das videoaulas"');
  });

  it("recreates the native player for each published lesson and avoids broken media links", () => {
    expect(source).toContain("key={authorialVideoLessons[selectedAuthorialVideo].id}");
    expect(source).toContain('preload="auto"');
    expect(source).toContain("onLoadedMetadata={() => setAuthorialVideoLoadError(false)}");
    expect(source).toContain("onError={() => setAuthorialVideoLoadError(true)}");
    expect(source).toContain("Esta aula está em roteiro e ainda não possui arquivo de vídeo publicado.");
  });
});

export {};
