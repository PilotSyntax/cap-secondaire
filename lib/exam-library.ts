import type { Question, Subject } from "./app-data";
import { QUESTION_BANK } from "./question-bank";

export type ExamCategory = "Express" | "Par matière" | "Par école" | "Simulations";

export type ExamDefinition = {
  id: string;
  name: string;
  duration: number;
  count: number;
  subjects: Subject[];
  description: string;
  accent: "teal" | "indigo" | "coral" | "gold";
  category: ExamCategory;
  badge: string;
  symbol: string;
  composition?: Partial<Record<Subject, number>>;
  skills?: string[];
  note?: string;
};

export const EXAM_CATEGORIES: ExamCategory[] = ["Express", "Par matière", "Par école", "Simulations"];

export const EXAM_LIBRARY: ExamDefinition[] = [
  {
    id: "mini-mixte",
    name: "Mini examen mixte",
    duration: 25,
    count: 12,
    subjects: ["Français", "Mathématiques"],
    description: "Un départ rapide pour vérifier les bases dans les deux matières principales.",
    accent: "teal",
    category: "Express",
    badge: "Rapide",
    symbol: "◷",
    composition: { Français: 6, Mathématiques: 6 },
  },
  {
    id: "francais-express",
    name: "Français express",
    duration: 20,
    count: 12,
    subjects: ["Français"],
    description: "Grammaire, orthographe, vocabulaire et conjugaison en format court.",
    accent: "coral",
    category: "Express",
    badge: "Rapide",
    symbol: "F",
  },
  {
    id: "math-express",
    name: "Mathématiques express",
    duration: 25,
    count: 12,
    subjects: ["Mathématiques"],
    description: "Calcul, fractions, décimaux et géométrie pour un bilan immédiat.",
    accent: "indigo",
    category: "Express",
    badge: "Rapide",
    symbol: "∑",
  },
  {
    id: "fractions-express",
    name: "Fractions express",
    duration: 18,
    count: 10,
    subjects: ["Mathématiques"],
    description: "Une courte série ciblée pour maîtriser les fractions équivalentes.",
    accent: "gold",
    category: "Express",
    badge: "Ciblé",
    symbol: "½",
    skills: ["Fractions"],
  },
  {
    id: "logique-express",
    name: "Logique express",
    duration: 15,
    count: 10,
    subjects: ["Logique"],
    description: "Suites, analogies et classement pour entraîner le raisonnement.",
    accent: "teal",
    category: "Express",
    badge: "Défi",
    symbol: "◇",
  },
  {
    id: "anglais-express",
    name: "English quick check",
    duration: 15,
    count: 10,
    subjects: ["Anglais"],
    description: "A quick check of vocabulary and simple-present grammar.",
    accent: "indigo",
    category: "Express",
    badge: "Quick",
    symbol: "EN",
  },
  {
    id: "francais-essentiel",
    name: "Français essentiel",
    duration: 50,
    count: 24,
    subjects: ["Français"],
    description: "Une révision complète des notions de langue attendues en 5e année.",
    accent: "coral",
    category: "Par matière",
    badge: "Complet",
    symbol: "F",
  },
  {
    id: "math-5e",
    name: "Mathématiques 5e année",
    duration: 55,
    count: 24,
    subjects: ["Mathématiques"],
    description: "Un portrait équilibré des nombres, opérations, mesures et formes.",
    accent: "indigo",
    category: "Par matière",
    badge: "Complet",
    symbol: "∑",
  },
  {
    id: "fractions-decimaux",
    name: "Fractions et décimaux",
    duration: 40,
    count: 20,
    subjects: ["Mathématiques"],
    description: "Deux notions clés réunies dans un examen progressif et ciblé.",
    accent: "gold",
    category: "Par matière",
    badge: "Ciblé",
    symbol: "0,5",
    skills: ["Fractions", "Nombres décimaux"],
  },
  {
    id: "problemes-mesure",
    name: "Problèmes, mesure et géométrie",
    duration: 45,
    count: 20,
    subjects: ["Mathématiques"],
    description: "Des problèmes concrets qui demandent de choisir la bonne stratégie.",
    accent: "teal",
    category: "Par matière",
    badge: "Ciblé",
    symbol: "△",
    skills: ["Opérations", "Mesure et géométrie"],
  },
  {
    id: "defis-logique",
    name: "Défis de logique",
    duration: 40,
    count: 24,
    subjects: ["Logique"],
    description: "Un parcours soutenu pour reconnaître des règles et des relations.",
    accent: "teal",
    category: "Par matière",
    badge: "Défi",
    symbol: "◇",
  },
  {
    id: "english-readiness",
    name: "English readiness",
    duration: 40,
    count: 24,
    subjects: ["Anglais"],
    description: "Vocabulary and grammar practice in a longer admission-style format.",
    accent: "indigo",
    category: "Par matière",
    badge: "Complete",
    symbol: "EN",
  },
  {
    id: "college-laval",
    name: "Simulation Collège Laval",
    duration: 75,
    count: 30,
    subjects: ["Français", "Mathématiques"],
    description: "Une simulation à dominante française, suivie d’un bloc de mathématiques.",
    accent: "indigo",
    category: "Par école",
    badge: "École",
    symbol: "CL",
    composition: { Français: 18, Mathématiques: 12 },
    note: "Répartition pédagogique : 60 % français et 40 % mathématiques.",
  },
  {
    id: "college-letendre",
    name: "Simulation Collège Letendre",
    duration: 85,
    count: 28,
    subjects: ["Français", "Mathématiques"],
    description: "Deux blocs équilibrés pour pratiquer la gestion du temps par matière.",
    accent: "teal",
    category: "Par école",
    badge: "École",
    symbol: "L",
    composition: { Français: 14, Mathématiques: 14 },
    note: "Prévoir un bloc de français puis un bloc de mathématiques.",
  },
  {
    id: "brebeuf",
    name: "Simulation Brébeuf",
    duration: 125,
    count: 32,
    subjects: ["Français", "Mathématiques", "Logique"],
    description: "Un long bloc de français et une séquence concentrée de mathématiques et logique.",
    accent: "gold",
    category: "Par école",
    badge: "École",
    symbol: "B",
    composition: { Français: 22, Mathématiques: 5, Logique: 5 },
    note: "Le format favorise l’endurance en français et un raisonnement rapide ensuite.",
  },
  {
    id: "college-citoyen",
    name: "Simulation Collège Citoyen",
    duration: 60,
    count: 24,
    subjects: ["Français", "Mathématiques"],
    description: "Un questionnaire chronométré et équilibré en français et mathématiques.",
    accent: "coral",
    category: "Par école",
    badge: "École",
    symbol: "CC",
    composition: { Français: 12, Mathématiques: 12 },
    note: "L’atelier de leadership distinct n’est pas reproduit dans cette simulation.",
  },
  {
    id: "standard-admission",
    name: "Examen standard d’admission",
    duration: 90,
    count: 30,
    subjects: ["Français", "Mathématiques", "Logique"],
    description: "Un examen général pour mesurer les acquis et repérer les priorités de révision.",
    accent: "indigo",
    category: "Simulations",
    badge: "Standard",
    symbol: "▤",
    composition: { Français: 14, Mathématiques: 12, Logique: 4 },
  },
  {
    id: "sprint-90",
    name: "Sprint 90 minutes",
    duration: 90,
    count: 36,
    subjects: ["Français", "Mathématiques", "Logique"],
    description: "Un rythme soutenu pour apprendre à avancer sans rester bloqué.",
    accent: "coral",
    category: "Simulations",
    badge: "Intensif",
    symbol: "⚡",
    composition: { Français: 16, Mathématiques: 14, Logique: 6 },
  },
  {
    id: "admission-2026-avance",
    name: "Défi admission 2026 · Avancé",
    duration: 55,
    count: 24,
    subjects: ["Français", "Mathématiques", "Logique"],
    description: "Nouveaux problèmes à étapes, compréhension, langue et logique de niveau moyen à élevé.",
    accent: "teal",
    category: "Simulations",
    badge: "2026 · Avancé",
    symbol: "26",
    composition: { Français: 10, Mathématiques: 10, Logique: 4 },
    note: "Contenu original aligné sur les formats publics d’admission 2027-2028; ce ne sont pas des questions confidentielles d’école.",
  },
  {
    id: "jour-j",
    name: "Simulation complète Jour J",
    duration: 150,
    count: 48,
    subjects: ["Français", "Mathématiques", "Logique"],
    description: "La simulation la plus complète pour travailler endurance, précision et stratégie.",
    accent: "gold",
    category: "Simulations",
    badge: "Longue",
    symbol: "◎",
    composition: { Français: 22, Mathématiques: 18, Logique: 8 },
  },
];

function examOffset(id: string) {
  return Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

function selectUnique(pool: Question[], count: number, offset: number) {
  if (!pool.length || count <= 0) return [];
  const selected: Question[] = [];
  const used = new Set<string>();
  let cursor = offset % pool.length;
  let attempts = 0;
  while (selected.length < Math.min(count, pool.length) && attempts < pool.length * 2) {
    const question = pool[cursor];
    if (!used.has(question.id)) {
      selected.push(question);
      used.add(question.id);
    }
    cursor = (cursor + 17) % pool.length;
    attempts += 1;
  }
  if (selected.length < Math.min(count, pool.length)) {
    for (const question of pool) {
      if (selected.length >= Math.min(count, pool.length)) break;
      if (!used.has(question.id)) selected.push(question);
    }
  }
  return selected;
}

export function buildExamQuestions(exam: ExamDefinition, options: { excludeIds?: string[]; attempt?: number; minDifficulty?: Question["difficulty"]; preferSession2026?: boolean } = {}) {
  const excluded = new Set(options.excludeIds ?? []);
  const attempt = options.attempt ?? 0;
  const offset = examOffset(exam.id) + attempt * 37;
  const eligible = (question: Question) =>
    (!options.minDifficulty || question.difficulty >= options.minDifficulty) &&
    (!options.preferSession2026 || question.tags.includes("session-2026"));

  if (exam.composition) {
    return (Object.entries(exam.composition) as [Subject, number][]).flatMap(([subject, count], index) => {
      const fullPool = QUESTION_BANK.filter((question) => question.subject === subject && eligible(question));
      const freshPool = fullPool.filter((question) => !excluded.has(question.id));
      return selectUnique(freshPool.length >= count ? freshPool : fullPool, count, offset + index * 23);
    });
  }

  const fullPool = QUESTION_BANK.filter((question) =>
    exam.subjects.includes(question.subject) && (!exam.skills || exam.skills.includes(question.skill)) && eligible(question),
  );
  const freshPool = fullPool.filter((question) => !excluded.has(question.id));
  return selectUnique(freshPool.length >= exam.count ? freshPool : fullPool, exam.count, offset);
}

export function validateExamLibrary() {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (EXAM_LIBRARY.length < 16) errors.push("Moins de 16 examens disponibles");

  for (const exam of EXAM_LIBRARY) {
    if (ids.has(exam.id)) errors.push(`${exam.id}: identifiant d’examen dupliqué`);
    ids.add(exam.id);
    if (exam.duration <= 0 || exam.count <= 0) errors.push(`${exam.id}: durée ou nombre de questions invalide`);
    if (!exam.subjects.length) errors.push(`${exam.id}: aucune matière`);
    if (exam.category === "Par école" && !exam.note) errors.push(`${exam.id}: note de simulation manquante`);
    if (exam.composition) {
      const total = Object.values(exam.composition).reduce((sum, count) => sum + (count ?? 0), 0);
      if (total !== exam.count) errors.push(`${exam.id}: la composition totalise ${total} questions au lieu de ${exam.count}`);
    }

    const questions = buildExamQuestions(exam);
    if (questions.length !== exam.count) errors.push(`${exam.id}: ${questions.length} questions assemblées au lieu de ${exam.count}`);
    if (new Set(questions.map((question) => question.id)).size !== questions.length) errors.push(`${exam.id}: questions dupliquées`);
  }

  return errors;
}
