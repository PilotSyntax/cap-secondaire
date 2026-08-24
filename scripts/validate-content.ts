import { READING_TEXTS, WRITING_ACTIVITIES } from "../lib/app-data";
import { EXAM_LIBRARY, validateExamLibrary } from "../lib/exam-library";
import { QUESTION_BANK, validateQuestionBank } from "../lib/question-bank";

const counts = Object.fromEntries(["Français", "Mathématiques", "Logique", "Anglais"].map((subject) => [subject, QUESTION_BANK.filter((question) => question.subject === subject).length]));
const errors = [...validateQuestionBank(), ...validateExamLibrary()];

if (counts.Français < 150) errors.push("Moins de 150 questions de français");
if (counts.Mathématiques < 150) errors.push("Moins de 150 questions de mathématiques");
if (counts.Logique < 50) errors.push("Moins de 50 questions de logique");
if (counts.Anglais < 50) errors.push("Moins de 50 questions d’anglais");
if (READING_TEXTS.length < 5) errors.push("Moins de 5 textes de compréhension");
if (WRITING_ACTIVITIES.length < 5) errors.push("Moins de 5 activités d’écriture");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Contenu validé : ${QUESTION_BANK.length} questions, ${EXAM_LIBRARY.length} examens, ${READING_TEXTS.length} textes et ${WRITING_ACTIVITIES.length} activités d’écriture.`);
