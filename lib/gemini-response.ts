export type GeminiResponsePayload = {
  candidates?: Array<{
    finishReason?: string;
    content?: { parts?: Array<{ text?: string }> };
    safetyRatings?: Array<{ blocked?: boolean }>;
  }>;
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: Array<{ blocked?: boolean }>;
  };
};

export function isGeminiBlocked(payload: GeminiResponsePayload) {
  const candidate = payload.candidates?.[0];
  return Boolean(
    payload.promptFeedback?.blockReason ||
    candidate?.finishReason === "SAFETY" ||
    payload.promptFeedback?.safetyRatings?.some((rating) => rating.blocked) ||
    candidate?.safetyRatings?.some((rating) => rating.blocked),
  );
}

export function extractGeminiText(payload: GeminiResponsePayload) {
  const parts = payload.candidates?.[0]?.content?.parts;
  if (!parts?.length) return null;
  const text = parts.map((part) => part.text ?? "").join("").trim();
  return text || null;
}
