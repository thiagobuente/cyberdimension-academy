import { describe, expect, it } from "vitest";
import { getAudioLabFavorites, toggleAudioLabFavorite } from "./db";
describe("audioLabFavorites", () => {
  it("favoritos começam vazios e alternam com toggleAudioLabFavorite", async () => {
    const episodeId = "audio-ctf01-ctf-primeiro-flag";
    // Testes compartilham o mesmo banco de dados; garantir estado limpo antes das asserções.
    await toggleAudioLabFavorite(9999, episodeId).catch(() => undefined);
    const before = await getAudioLabFavorites(9999);
    const preExisting = before.filter((row) => row.episodeId === episodeId);
    if (preExisting.length > 0) {
      await toggleAudioLabFavorite(9999, episodeId);
    }
    const cleanState = await getAudioLabFavorites(9999);
    expect(cleanState.filter((row) => row.episodeId === episodeId).length).toBe(0);
    const added = await toggleAudioLabFavorite(9999, episodeId);
    expect(added.favorite).toBe(true);
    const after = await getAudioLabFavorites(9999);
    expect(after.some((row) => row.episodeId === episodeId)).toBe(true);
    const removed = await toggleAudioLabFavorite(9999, episodeId);
    expect(removed.favorite).toBe(false);
    const finalCheck = await getAudioLabFavorites(9999);
    expect(finalCheck.filter((row) => row.episodeId === episodeId).length).toBe(0);
  });
});
