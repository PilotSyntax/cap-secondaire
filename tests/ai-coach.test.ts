import assert from "node:assert/strict";
import test from "node:test";
import { buildLocalAiResult } from "../lib/ai-local";
import { validateAiRequest } from "../lib/ai-types";
import { extractGeminiText, isGeminiBlocked } from "../lib/gemini-response";

test("le mode local produit un exercice vérifiable et personnalisé", () => {
  const result = buildLocalAiResult({ action: "exercise", subject: "Mathématiques", skill: "Fractions" });
  assert.equal(result.source, "local");
  assert.equal(result.safe, true);
  assert.ok(result.practice);
  assert.equal(result.practice?.options.length, 4);
  assert.ok(result.practice?.options.includes(result.practice.answer));
  assert.match(result.title, /Fractions/);
});

test("le coach transforme une erreur en explication et nouvel essai", () => {
  const result = buildLocalAiResult({
    action: "coach",
    error: { question: "Quelle fraction est équivalente à 1/2?", given: "2/3", answer: "2/4", skill: "Fractions", explanation: "On multiplie les deux termes par le même nombre." },
  });
  assert.match(result.message, /2\/3/);
  assert.ok(result.steps.length >= 3);
  assert.ok(result.practice);
});

test("l’API refuse les actions inconnues et les questions trop longues", () => {
  assert.equal(validateAiRequest({ action: "inventer", prompt: "Bonjour" }), null);
  assert.equal(validateAiRequest({ action: "ask", prompt: "x".repeat(601) }), null);
  assert.ok(validateAiRequest({ action: "ask", prompt: "Explique-moi les fractions" }));
});

test("la réponse structurée Gemini est extraite sans perdre de segments", () => {
  const text = extractGeminiText({ candidates: [{ content: { parts: [{ text: "{\"title\":" }, { text: "\"Bravo\"}" }] } }] });
  assert.equal(text, "{\"title\":\"Bravo\"}");
});

test("un blocage de sécurité Gemini déclenche la redirection locale", () => {
  assert.equal(isGeminiBlocked({ promptFeedback: { blockReason: "SAFETY" } }), true);
  assert.equal(isGeminiBlocked({ candidates: [{ finishReason: "STOP" }] }), false);
});
