import { ENV } from "./_core/env";

type TutorMessage = { role: "system" | "user" | "assistant"; content: string };

type NvidiaChatResponse = {
  choices?: Array<{ message?: { content?: unknown } }>;
};

const NVIDIA_TIMEOUT_MS = 8_000;
const NVIDIA_MAX_MESSAGES = 10;
const NVIDIA_MAX_MESSAGE_CHARS = 3_000;

export function canUseNvidiaTutor() {
  return Boolean(ENV.nvidiaApiKey) && process.env.NODE_ENV !== "test";
}

export function normalizeNvidiaMessages(messages: TutorMessage[]) {
  return messages.slice(-NVIDIA_MAX_MESSAGES).map((message) => ({
    role: message.role,
    content: message.content.slice(0, NVIDIA_MAX_MESSAGE_CHARS),
  }));
}

export async function invokeNvidiaTutor(messages: TutorMessage[]) {
  if (!canUseNvidiaTutor()) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NVIDIA_TIMEOUT_MS);
  try {
    const response = await fetch(`${ENV.nvidiaBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.nvidiaApiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: ENV.nvidiaModel,
        messages: normalizeNvidiaMessages(messages),
        temperature: 0.25,
        max_tokens: 900,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as NvidiaChatResponse;
    const content = payload.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? content.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
