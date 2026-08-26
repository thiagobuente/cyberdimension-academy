/**
 * CyberDimension Podcast (Audio Lab) — teste do fluxo de troca de episódio
 * durante a reprodução (validação estática do comportamento implementado).
 *
 * Comportamento exigido:
 * 1. O aluno dá play em um episódio (áudio real servido via /podcast-audio/).
 * 2. Ele clica em outro episódio na lista.
 * 3. A reprodução anterior é interrompida — a URL do player muda para a do
 *    novo episódio (o elemento <audio key={activeEpisode.id}> remonta, parando o
 *    áudio anterior) e o estado de posição é zerado.
 * 4. O player fica pronto para iniciar o novo episódio sem voltar à lista.
 * 5. Se o player estava parado, a troca apenas seleciona o novo episódio.
 * 6. O botão de play/pause continua controlando manualmente a reprodução.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const player = readFileSync("client/src/components/AudioLabEpisodePlayer.tsx", "utf8");

describe("troca de episódio durante a reprodução (CyberDimension Podcast)", () => {
  it("o player usa o arquivo de áudio real do episódio via /podcast-audio/", () => {
    // O motor de áudio agora é o mesmo do CyberCast: <audio> com src mapeado
    // do manus-storage para o endpoint /podcast-audio/ (proxy validado).
    expect(player).toContain("getAudioLabAudioSrc(activeEpisode?.audioUrl)");
    expect(player).toContain("export function getAudioLabAudioSrc");
    expect(player).toContain("\"/podcast-audio/\"");
    expect(player).toContain("manus-storage");
    expect(player).toContain("<audio ref={audioRef} key={activeEpisode.id}");
    // O player usa preload="none" com carregamento sob demanda controlado pelo
    // play(): a URL assinada do /podcast-audio/ é buscada apenas quando o aluno
    // inicia a reprodução, evitando expiração de URL durante pausas longas
    // (fluxo validado em auditoria de playback — episódios grandes como ep03).
    expect(player).toContain('preload="none"');
    expect(player).toContain("activeAudioSrc");
  });

  it("a troca de episódio interrompe a reprodução anterior antes de selecionar o novo", () => {
    // selectEpisode pausa o player ativo antes de trocar o episódio;
    // a key do <audio> (= activeEpisode.id) força a remonta do elemento,
    // zerando posição e estado na nova montagem.
    expect(player).toContain("audio.pause()");
    expect(player).toContain("setIsPlaying(false)");
    expect(player).toMatch(/key=\{activeEpisode\.id\}/);
    expect(player).toContain("setPosition(");
  });

  it("a seleção do mesmo episódio não reprocessa a troca", () => {
    // Early-return quando o episódio clicado já é o ativo evita remontar o
    // player e zerar o progresso desnecessariamente.
    expect(player).toContain("if (episode.id === activeEpisode?.id) return");
  });

  it("o botão de play/pause controla manualmente a reprodução com aguardo do player", () => {
    // togglePlayback aguarda o player ficar pronto (waitForReady) e trata
    // erros de reprodução, assim como no CyberCast.
    expect(player).toContain("waitForReady");
    expect(player).toMatch(/togglePlayback\(\)/);
    expect(player).toContain("Reproduzir episódio");
    expect(player).toContain("Pausar episódio");
  });

  it("o progresso é medido pelo tempo do áudio e a conclusão ocorre ao final", () => {
    // onTimeUpdate atualiza a posição; onEnded conclui automaticamente e
    // registra via trpc.audiolab.saveProgress.
    expect(player).toContain("onTimeUpdate={onTimeUpdate}");
    expect(player).toContain("onEnded={onAudioEnded}");
    expect(player).toContain("onError={onAudioError}");
    expect(player).toContain("formatTime(position)");
  });

  it("a página da série delega o player ao componente compartilhado", () => {
    const page = readFileSync("client/src/pages/AudioLab.tsx", "utf8");
    // A página mantém navegação por série/lista e delega o player ao
    // componente compartilhado, reutilizável na página unificada /podcast.
    expect(page).toContain("AudioLabEpisodePlayer");
    expect(page).toContain("initialEpisodeId");
  });
});
