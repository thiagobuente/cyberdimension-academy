export type TutorChatMessage = { role: "user" | "assistant"; content: string };
export type TutorProvider = "nvidia" | "builtin";

export function getTutorProviderLabel(provider?: TutorProvider) {
  return provider === "nvidia" ? "NVIDIA NIM" : "Fallback LLM";
}

export async function copyTutorResponse(text: string) {
  if (!text.trim()) return false;
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Use the legacy fallback below when permission or browser support is unavailable.
  }

  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand?.("copy") ?? false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function getRegenerationTarget(messages: TutorChatMessage[], assistantIndex: number) {
  const userIndex = [...messages.slice(0, assistantIndex)].reverse().findIndex((item) => item.role === "user");
  if (userIndex < 0) return null;
  const actualUserIndex = assistantIndex - 1 - userIndex;
  const prompt = messages[actualUserIndex]?.content;
  return prompt ? { userIndex: actualUserIndex, prompt } : null;
}
