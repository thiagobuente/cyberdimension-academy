/**
 * Teste de integridade dos áudios do catálogo.
 *
 * Valida que cada `audioUrl` definido nos episódios do CyberCast (podcast)
 * e do CyberDimension Podcast (Audio Lab) aponta para um arquivo que
 * responde HTTP 200 no proxy `/podcast-audio/` do servidor.
 *
 * Garante regressão: nenhum episódio passa a apontar para um .wav
 * inexistente no storage (causa anterior de erros 502/403 no player).
 */
import express from "express";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { ENV } from "./_core/env";
import { registerStorageProxy } from "./_core/storageProxy";

// Catálogos do CyberCast
import * as podcastEpisodes from "../shared/podcastEpisodes";
import * as podcastFullSeries from "../shared/podcastFullSeriesEpisodes";
import * as podcastSeasonTwo from "../shared/podcastSeasonTwoEpisodes";
import * as podcastSeasonThree from "../shared/podcastSeasonThreeEpisodes";
import * as podcastDeepDive from "../shared/podcastDeepDiveEpisodes";
import * as podcastBonus from "../shared/podcastBonusEpisodes";
import * as podcastEnglishExpansion from "../shared/podcastEnglishExpansion";
import * as podcastEp68 from "../shared/podcastEp68English";
import * as podcastEp69 from "../shared/podcastEp69NetworkSecurity";
import * as podcastEp70 from "../shared/podcastEp70CloudSecurity";
import * as podcastEp71 from "../shared/podcastEp71IncidentResponse";
import * as podcastEp72 from "../shared/podcastEp72PenetrationTesting";
import * as podcastRaioX from "../shared/podcastRaioxEpisodes";
import * as podcastBatchFour from "../shared/podcastBatchFourEpisodes";

// Catálogos do CyberDimension Podcast (Audio Lab)
import * as audioLabSecurityPlus from "../shared/audioLab/audioLabSecurityPlus";
import * as audioLabEnglish from "../shared/audioLab/audioLabEnglish";
import * as audioLabSocRadio from "../shared/audioLab/audioLabSocRadio";
import * as audioLabRedTeam from "../shared/audioLab/audioLabRedTeam";
import * as audioLabBlueTeam from "../shared/audioLab/audioLabBlueTeam";
import * as audioLabCloud from "../shared/audioLab/audioLabCloud";
import * as audioLabAI from "../shared/audioLab/audioLabAI";
import * as audioLabGRC from "../shared/audioLab/audioLabGRC";
import * as audioLabCtfCases from "../shared/audioLab/audioLabCtfCases";

const PODCAST_MODULES = [
  podcastEpisodes,
  podcastFullSeries,
  podcastSeasonTwo,
  podcastSeasonThree,
  podcastDeepDive,
  podcastBonus,
  podcastEnglishExpansion,
  podcastEp68,
  podcastEp69,
  podcastEp70,
  podcastEp71,
  podcastEp72,
  podcastRaioX,
  podcastBatchFour,
] as const;

const AUDIO_LAB_MODULES = [
  audioLabSecurityPlus,
  audioLabEnglish,
  audioLabSocRadio,
  audioLabRedTeam,
  audioLabBlueTeam,
  audioLabCloud,
  audioLabAI,
  audioLabGRC,
  audioLabCtfCases,
] as const;

type HasAudio = { id?: string | number; audioUrl?: string };

function collectAudioUrls(): Array<{ source: string; audioUrl: string }> {
  const urls: Array<{ source: string; audioUrl: string }> = [];
  for (const mod of PODCAST_MODULES) {
    for (const [key, value] of Object.entries(mod)) {
      const ep = value as unknown as HasAudio;
      if (
        value &&
        typeof value === "object" &&
        typeof ep.audioUrl === "string" &&
        ep.audioUrl.includes(".wav")
      ) {
        urls.push({ source: `${mod.name || key}`, audioUrl: ep.audioUrl });
      }
    }
  }
  for (const mod of AUDIO_LAB_MODULES) {
    for (const [key, value] of Object.entries(mod)) {
      const arr = Array.isArray(value)
        ? (value as Array<HasAudio>)
        : null;
      if (arr && arr.length > 0 && typeof arr[0].audioUrl === "string") {
        for (const item of arr) {
          if (item.audioUrl) {
            urls.push({ source: key, audioUrl: item.audioUrl });
          }
        }
      } else if (
        value &&
        typeof value === "object" &&
        typeof (value as unknown as HasAudio).audioUrl === "string"
      ) {
        const ep = value as unknown as HasAudio;
        urls.push({ source: key, audioUrl: ep.audioUrl as string });
      }
    }
  }
  return urls;
}

const PORT = 4199;
let server: ReturnType<typeof express> | undefined;
let baseUrl = "";

beforeAll(async () => {
  const app = express();
  registerStorageProxy(app);
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, "127.0.0.1", () => resolve());
  });
  baseUrl = `http://127.0.0.1:${PORT}`;
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()));
  }
});

async function checkAudio(audioUrl: string): Promise<number> {
  const key = audioUrl.replace(/\/manus-storage\//i, "").replace(".wav", "");
  try {
    const res = await fetch(`${baseUrl}/podcast-audio/${encodeURIComponent(key)}.wav`, {
      method: "HEAD",
    });
    return res.status;
  } catch {
    return 0;
  }
}

describe("Catálogo de áudios — integridade das URLs", () => {
  test("o proxy requer forgeApiUrl/forgeApiKey", () => {
    expect(ENV.forgeApiUrl).toBeTruthy();
    expect(ENV.forgeApiKey).toBeTruthy();
  });

  test("todos os audioUrl do podcast e do CyberDimension Podcast respondem 200", async () => {
    const urls = collectAudioUrls();
    expect(urls.length).toBeGreaterThan(100);

    const failures: Array<{ source: string; audioUrl: string; status: number }> = [];
    for (const entry of urls) {
      const status = await checkAudio(entry.audioUrl);
      if (status !== 200) failures.push({ ...entry, status });
    }

    expect(
      failures,
      failures.map((f) => `${f.source} -> ${f.audioUrl} (HTTP ${f.status})`).join("\n") ||
        "todos ok",
    ).toHaveLength(0);
  }, 60_000);
});
