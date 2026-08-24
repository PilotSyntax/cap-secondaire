import assert from "node:assert/strict";
import test from "node:test";
import { activitiesFor, activityToQuestion, FRENCH_ACTIVITIES, normalizeFrenchAnswer } from "../lib/french-workshop";

test("l’atelier propose 60 activités réparties dans quatre formats", () => {
  assert.equal(FRENCH_ACTIVITIES.length, 60);
  assert.equal(FRENCH_ACTIVITIES.filter((item) => item.category === "Conjugaison").length, 24);
  assert.equal(FRENCH_ACTIVITIES.filter((item) => item.category === "Orthographe").length, 16);
  assert.equal(FRENCH_ACTIVITIES.filter((item) => item.category === "Correction").length, 12);
  assert.equal(FRENCH_ACTIVITIES.filter((item) => item.category === "Dictée").length, 8);
  assert.equal(new Set(FRENCH_ACTIVITIES.map((item) => item.id)).size, FRENCH_ACTIVITIES.length);
});

test("chaque série contient huit activités uniques et complètes", () => {
  for (const category of ["Conjugaison", "Orthographe", "Correction", "Dictée"] as const) {
    const session = activitiesFor(category, 8, 3);
    assert.equal(session.length, 8);
    assert.equal(new Set(session.map((item) => item.id)).size, 8);
    assert.ok(session.every((item) => item.prompt && item.answer && item.explanation && item.hint));
  }
});

test("la comparaison tolère la casse, les apostrophes et la ponctuation finale", () => {
  assert.equal(normalizeFrenchAnswer("  J’IRAI chercher mes livres. "), normalizeFrenchAnswer("j'irai chercher mes livres"));
});

test("une activité devient une question suivie par le carnet d’erreurs", () => {
  const question = activityToQuestion(FRENCH_ACTIVITIES[0]);
  assert.equal(question.subject, "Français");
  assert.equal(question.grade, "6e");
  assert.equal(question.answer, FRENCH_ACTIVITIES[0].answer);
});
