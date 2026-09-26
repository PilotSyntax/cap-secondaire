import assert from "node:assert/strict";
import test from "node:test";
import { buildExamQuestions, EXAM_LIBRARY, validateExamLibrary } from "../lib/exam-library";

test("la bibliothèque propose au moins 16 examens valides", () => {
  assert.ok(EXAM_LIBRARY.length >= 16);
  assert.deepEqual(validateExamLibrary(), []);
});

test("chaque examen assemble le bon nombre de questions sans doublon", () => {
  for (const exam of EXAM_LIBRARY) {
    const questions = buildExamQuestions(exam);
    assert.equal(questions.length, exam.count, exam.id);
    assert.equal(new Set(questions.map((question) => question.id)).size, exam.count, exam.id);
  }
});

test("la simulation Collège Laval respecte sa composition 60/40", () => {
  const exam = EXAM_LIBRARY.find((item) => item.id === "college-laval");
  assert.ok(exam);
  const questions = buildExamQuestions(exam);
  assert.equal(questions.filter((question) => question.subject === "Français").length, 18);
  assert.equal(questions.filter((question) => question.subject === "Mathématiques").length, 12);
});


test("la simulation admission 2026 privilégie les questions moyennes et difficiles", () => {
  const exam = EXAM_LIBRARY.find((item) => item.id === "admission-2026-avance");
  assert.ok(exam);
  const questions = buildExamQuestions(exam, { minDifficulty: 2, preferSession2026: true });
  assert.equal(questions.length, exam.count);
  assert.ok(questions.every((question) => question.difficulty >= 2));
  assert.ok(questions.every((question) => question.tags.includes("session-2026")));
});

test("une nouvelle tentative peut éviter les questions récemment vues", () => {
  const exam = EXAM_LIBRARY.find((item) => item.id === "admission-2026-avance");
  assert.ok(exam);
  const first = buildExamQuestions(exam, { minDifficulty: 2, preferSession2026: true });
  const second = buildExamQuestions(exam, { minDifficulty: 2, preferSession2026: true, excludeIds: first.map((question) => question.id), attempt: 1 });
  assert.equal(second.length, exam.count);
  assert.ok(second.some((question) => !first.some((previous) => previous.id === question.id)));
});
