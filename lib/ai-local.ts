import { QUESTION_BANK } from "./question-bank";
import type { Question, Subject } from "./app-data";
import type { AiCoachResult, AiPractice, AiRequest } from "./ai-types";

function hash(value: string) {
  return [...value].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
}

function selectQuestion(subject: Subject | undefined, skill: string | undefined, seed: string): Question {
  const normalizedSkill = skill?.toLocaleLowerCase("fr-CA");
  const exact = QUESTION_BANK.filter((question) =>
    (!subject || question.subject === subject) &&
    (!normalizedSkill || `${question.skill} ${question.subSkill}`.toLocaleLowerCase("fr-CA").includes(normalizedSkill)),
  );
  const bySubject = QUESTION_BANK.filter((question) => !subject || question.subject === subject);
  const pool = exact.length ? exact : bySubject.length ? bySubject : QUESTION_BANK;
  return pool[hash(seed) % pool.length];
}

function toPractice(question: Question): AiPractice {
  return {
    question: question.prompt,
    options: question.options,
    answer: question.answer,
    explanation: `${question.solution}. ${question.explanation}`,
  };
}

function inferSubject(text: string): Subject | undefined {
  const normalized = text.toLocaleLowerCase("fr-CA");
  if (/fraction|calcul|math|décimal|périmètre|géométr/.test(normalized)) return "Mathématiques";
  if (/accord|grammaire|français|lecture|verbe|orthographe/.test(normalized)) return "Français";
  if (/logique|suite|déduction/.test(normalized)) return "Logique";
  if (/anglais|english|vocabulary/.test(normalized)) return "Anglais";
  return undefined;
}

export function buildLocalAiResult(request: AiRequest): AiCoachResult {
  const seed = `${request.action}:${request.subject ?? ""}:${request.skill ?? ""}:${request.prompt ?? ""}:${request.error?.question ?? ""}`;

  if (request.action === "exercise") {
    const question = selectQuestion(request.subject, request.skill, seed);
    return {
      title: `Exercice personnalisé · ${question.skill}`,
      message: `Voici un exercice de ${question.subject.toLocaleLowerCase("fr-CA")} choisi selon la compétence « ${request.skill || question.skill} ». Prends le temps d’expliquer ton raisonnement avant de vérifier.`,
      steps: ["Lis la consigne une première fois.", "Repère les données utiles.", "Choisis ta réponse, puis explique pourquoi."],
      practice: toPractice(question),
      source: "local",
      safe: true,
    };
  }

  if (request.action === "coach") {
    const entry = request.error;
    const subject = request.subject ?? inferSubject(`${entry?.skill ?? ""} ${entry?.question ?? request.prompt ?? ""}`);
    const question = selectQuestion(subject, entry?.skill ?? request.skill, seed);
    return {
      title: `On reprend ${entry?.skill || request.skill || "cette notion"}`,
      message: entry
        ? `Tu as choisi « ${entry.given} », alors que la réponse attendue était « ${entry.answer} ». Ce n’est pas grave : l’erreur nous montre exactement quoi revoir. ${entry.explanation}`
        : "On va reprendre la notion calmement, une étape à la fois, puis l’essayer dans un nouveau contexte.",
      steps: ["Reformule la question avec tes propres mots.", entry?.explanation || "Rappelle-toi la règle utile avant de calculer.", "Vérifie chaque étape plutôt que seulement la réponse finale."],
      practice: toPractice(question),
      source: "local",
      safe: true,
    };
  }

  const prompt = request.prompt ?? "";
  const normalized = prompt.toLocaleLowerCase("fr-CA");
  const subject = request.subject ?? inferSubject(prompt);
  const question = selectQuestion(subject, request.skill, seed);
  let message = "Je peux t’aider à comprendre une notion, à organiser ta démarche ou à t’entraîner. Donne-moi la matière et ce qui te bloque, puis nous avancerons une étape à la fois.";
  let steps = ["Nomme la notion qui te pose problème.", "Montre l’étape où tu hésites.", "Essaie un exemple semblable pour vérifier ta compréhension."];

  if (/fraction/.test(normalized)) {
    message = "Une fraction représente des parts égales d’un tout : le dénominateur indique le nombre total de parts égales et le numérateur indique combien de parts on prend.";
    steps = ["Identifie le numérateur et le dénominateur.", "Pour créer une fraction équivalente, multiplie les deux par le même nombre.", "Vérifie que la valeur de la fraction n’a pas changé."];
  } else if (/accord|grammaire|pluriel/.test(normalized)) {
    message = "Dans un groupe du nom, le déterminant, le nom et l’adjectif s’accordent généralement en genre et en nombre. Cherche d’abord le nom noyau : il guide les autres mots.";
    steps = ["Repère le nom noyau.", "Détermine son genre et son nombre.", "Accorde le déterminant et l’adjectif, puis relis le groupe complet."];
  } else if (/temps|examen|stress|stratég/.test(normalized)) {
    message = "À l’examen, commence par les questions que tu comprends rapidement. Marque celles qui demandent plus de réflexion et garde quelques minutes à la fin pour vérifier les consignes et les calculs.";
    steps = ["Lis toutes les consignes avant de commencer.", "Avance si une question te bloque plus de deux minutes.", "Réserve les cinq dernières minutes à la vérification."];
  }

  return { title: "Réponse du Coach Cap", message, steps, practice: toPractice(question), source: "local", safe: true };
}
