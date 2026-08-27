import type { Express } from "express";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });

  // Entrega direta das videoaulas por bytes, evitando que o elemento <video>
  // dependa de seguir um redirect assinado para outro domínio.
  app.get("/video-media/:key", async (req, res) => {
    const key = req.params.key;
    if (!key) {
      res.status(400).send("Missing video key");
      return;
    }

    try {
      const forgeUrl = new URL("v1/storage/presign/get", ENV.forgeApiUrl.replace(/\/+$/, "") + "/");
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, { headers: { Authorization: `Bearer ${ENV.forgeApiKey}` } });
      if (!forgeResp.ok) {
        console.error(`[VideoMedia] forge error: ${forgeResp.status}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      const rangeHeader = req.headers.range as string | undefined;
      const downstream = await fetch(url, rangeHeader ? { headers: { Range: rangeHeader } } : undefined);
      if (!downstream.ok && downstream.status !== 206) {
        res.status(downstream.status).send("Video storage read error");
        return;
      }

      res.status(downstream.status);
      res.setHeader("Content-Type", downstream.headers.get("content-type") || "video/mp4");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
      for (const header of ["content-length", "content-range", "last-modified", "etag"]) {
        const value = downstream.headers.get(header);
        if (value) res.setHeader(header, value);
      }

      const reader = downstream.body?.getReader();
      if (!reader) {
        res.status(502).send("No readable video body");
        return;
      }
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.write(value)) await new Promise<void>((resolve) => res.once("drain", resolve));
      }
      res.end();
    } catch (err) {
      console.error("[VideoMedia] failed:", err);
      if (!res.headersSent) res.status(502).send("Video media proxy error");
      else res.end();
    }
  });

  // Servimento direto de áudio do CyberCast por bytes no próprio servidor.
  // Evita o redirect 307 do <audio> — algumas redes/extensões/proxies falham ao
  // seguir redirects em requisições de mídia (Range), causando o erro "Não foi
  // possível iniciar o áudio" no navegador. O servidor baixa o áudio do storage
  // e o repassa ao navegador com Accept-Ranges e CORS completos.
  app.options("/podcast-audio/:key", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Range");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.status(204).end();
  });

  app.get("/podcast-audio/:key", async (req, res) => {
    const key = req.params.key;
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    // Fallback: para GET simples (sem Range), redirecionar para a URL assinada do
    // storage. Assim o navegador baixa o áudio direto do storage (que suporta
    // Range nativamente) e o servidor não consome memória/tempo de stream de
    // arquivos grandes — elimina o "Não foi possível iniciar o áudio" em
    // episódios longos (> ~30 MB) em ambientes com recursos limitados.
    const rangeHeader = req.headers.range as string | undefined;
    const isHead = req.method === "HEAD" || (req.method !== undefined && req.method === "OPTIONS");

    try {
      const forgeUrl = new URL("v1/storage/presign/get", ENV.forgeApiUrl.replace(/\/+$/, "") + "/");
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, { headers: { Authorization: `Bearer ${ENV.forgeApiKey}` } });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[PodcastAudio] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      // Sem Range: redirecionar o navegador para a URL assinada do storage
      // (CloudFront) — ele suporta Range nativamente e o download é muito mais
      // rápido que o stream pelo servidor, eliminando "Não foi possível iniciar
      // o áudio" em episódios grandes. Com Range (seek), o servidor proxya os
      // bytes por chunks, porque alguns clientes não seguem redirect em
      // requisições Range.
      if (!rangeHeader) {
        res.set("Cache-Control", "public, max-age=3600");
        res.redirect(307, url);
        return;
      }
      const downstreamHeaders: Record<string, string> = { Range: rangeHeader };
      res.status(206);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Range");
      res.setHeader("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      const downResp = await fetch(url, { headers: downstreamHeaders });
      if (!downResp.ok) {
        res.status(502).send("Storage read error");
        return;
      }
      downResp.headers.forEach((value, name) => {
        if (name.toLowerCase() === "content-range") res.setHeader("Content-Range", value);
        if (name.toLowerCase() === "content-length") res.setHeader("Content-Length", value);
      });
      const contentType = downResp.headers.get("content-type") || "audio/wav";
      res.setHeader("Content-Type", contentType);

      if (isHead) {
        res.end();
        return;
      }
      const reader = downResp.body?.getReader();
      if (!reader) {
        res.status(502).send("No readable body from storage");
        return;
      }
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const wrote = res.write(value);
        if (!wrote) {
          await new Promise<void>((resolve) => res.once("drain", resolve));
        }
      }
      res.end();
    } catch (err) {
      console.error("[PodcastAudio] failed:", err);
      if (!res.headersSent) res.status(502).send("Podcast audio proxy error");
      else res.end();
    }
  });
}
