import assert from "node:assert/strict";
import test from "node:test";
import { buildSmartPlan, updateMasteryScore } from "../lib/mastery";

test("une réussite difficile augmente la maîtrise", () => {
  const score = updateMasteryScore(60, { correct: true, difficulty: 4, responseSeconds: 60, expectedSeconds: 75, recentErrorCount: 0, daysSinceReview: 7 });
  assert.ok(score > 60);
});

test("une erreur récente diminue la maîtrise", () => {
  const score = updateMasteryScore(80, { correct: false, difficulty: 2, responseSeconds: 50, expectedSeconds: 60, recentErrorCount: 2, daysSinceReview: 1 });
  assert.ok(score < 80);
});

test("le plan priorise le plus faible score", () => {
  const plan = buildSmartPlan([
    { id: "a", subject: "Français", label: "Lecture", score: 85, trend: 2 },
    { id: "b", subject: "Mathématiques", label: "Fractions", score: 55, trend: -1 },
    { id: "c", subject: "Logique", label: "Suites", score: 70, trend: 1 },
    { id: "d", subject: "Anglais", label: "Reading", score: 74, trend: 2 },
  ], 35);
  assert.equal(plan[0].id, "b");
  assert.ok(plan.reduce((sum, item) => sum + item.minutes, 0) >= 30);
});
