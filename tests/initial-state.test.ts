import assert from "node:assert/strict";
import test from "node:test";
import { CURRENT_DATA_VERSION, DEFAULT_STATE, SCHOOLS } from "../lib/app-data";

test("le profil de démonstration commence avec une progression vierge", () => {
  assert.equal(DEFAULT_STATE.dataVersion, CURRENT_DATA_VERSION);
  assert.equal(DEFAULT_STATE.student.name, "Élève");
  assert.equal(DEFAULT_STATE.student.xp, 0);
  assert.equal(DEFAULT_STATE.student.streak, 0);
  assert.equal(DEFAULT_STATE.student.weeklyMinutes, 0);
  assert.equal(DEFAULT_STATE.completedQuestions, 0);
  assert.equal(DEFAULT_STATE.correctAnswers, 0);
  assert.equal(DEFAULT_STATE.diagnosticComplete, false);
  assert.deepEqual(DEFAULT_STATE.errors, []);
  assert.ok(DEFAULT_STATE.mastery.every((skill) => skill.score === 0 && skill.trend === 0));
});

test("aucun établissement n’est sélectionné dans le profil public", () => {
  assert.deepEqual(DEFAULT_STATE.selectedSchoolIds, []);
  assert.deepEqual(DEFAULT_STATE.schoolDateOverrides, {});
  assert.deepEqual(DEFAULT_STATE.schoolStatuses, {});
});

test("le catalogue contient les établissements configurables", () => {
  assert.equal(SCHOOLS.find((school) => school.id === "lafontaine")?.examDate, "2026-09-19");
  assert.equal(SCHOOLS.find((school) => school.id === "externat")?.examDate, "2026-09-26");
});
