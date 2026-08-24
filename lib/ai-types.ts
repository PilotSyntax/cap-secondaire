import type { ErrorEntry, Subject } from "./app-data";

export type AiAction = "ask" | "exercise" | "coach";

export type AiRequest = {
  action: AiAction;
  prompt?: string;
  subject?: Subject;
  skill?: string;
  error?: Pick<ErrorEntry, "question" | "given" | "answer" | "skill" | "explanation">;
};

export type AiPractice = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type AiCoachResult = {
  title: string;
  message: string;
  steps: string[];
  practice: AiPractice | null;
  source: "gemini" | "local";
  safe: true;
};

const SUBJECTS: Subject[] = ["Français", "Mathématiques", "Logique", "Anglais"];

export function validateAiRequest(value: unknown): AiRequest | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<AiRequest>;
  if (!candidate.action || !["ask", "exercise", "coach"].includes(candidate.action)) return null;
  if (candidate.prompt !== undefined && (typeof candidate.prompt !== "string" || candidate.prompt.trim().length > 600)) return null;
  if (candidate.subject !== undefined && !SUBJECTS.includes(candidate.subject)) return null;
  if (candidate.skill !== undefined && (typeof candidate.skill !== "string" || candidate.skill.length > 100)) return null;
  if (candidate.action === "ask" && !candidate.prompt?.trim()) return null;
  if (candidate.action === "exercise" && !candidate.subject) return null;
  if (candidate.action === "coach" && !candidate.error && !candidate.prompt?.trim()) return null;

  if (candidate.error) {
    const values = [candidate.error.question, candidate.error.given, candidate.error.answer, candidate.error.skill, candidate.error.explanation];
    if (values.some((entry) => typeof entry !== "string" || entry.length > 800)) return null;
  }

  return {
    action: candidate.action,
    prompt: candidate.prompt?.trim(),
    subject: candidate.subject,
    skill: candidate.skill?.trim(),
    error: candidate.error,
  };
}
