import type { SkillMastery } from "./app-data";

export type MasteryEvidence = {
  correct: boolean;
  difficulty: 1 | 2 | 3 | 4;
  responseSeconds: number;
  expectedSeconds: number;
  recentErrorCount: number;
  daysSinceReview: number;
};

export function updateMasteryScore(current: number, evidence: MasteryEvidence) {
  const outcome = evidence.correct ? 1 : 0;
  const difficultyWeight = 0.85 + evidence.difficulty * 0.1;
  const speedRatio = evidence.expectedSeconds / Math.max(15, evidence.responseSeconds);
  const speedFactor = Math.min(1.1, Math.max(0.85, speedRatio));
  const errorPenalty = Math.min(0.12, evidence.recentErrorCount * 0.025);
  const recencyFactor = Math.min(1.08, 0.94 + evidence.daysSinceReview * 0.01);
  const evidenceScore = Math.max(0, Math.min(100, 100 * outcome * difficultyWeight * speedFactor * recencyFactor - 100 * errorPenalty));
  const recentWeight = evidence.correct ? 0.24 : 0.32;
  return Math.round(Math.max(0, Math.min(100, current * (1 - recentWeight) + evidenceScore * recentWeight)));
}

export function buildSmartPlan(mastery: SkillMastery[], minutes: number) {
  const ranked = [...mastery].sort((a, b) => (a.score + a.trend * 0.25) - (b.score + b.trend * 0.25));
  const weights = [0.34, 0.27, 0.22, 0.17];
  return ranked.slice(0, 4).map((skill, index) => ({
    ...skill,
    minutes: Math.max(5, Math.round(minutes * weights[index])),
    reason: skill.score < 65 ? "Priorité de consolidation" : skill.trend < 0 ? "Erreur récente" : "Répétition espacée",
  }));
}
