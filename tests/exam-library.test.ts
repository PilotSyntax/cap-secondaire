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
