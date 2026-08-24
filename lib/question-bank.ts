import type { Question } from "./app-data";

function rotated(answer: string, distractors: string[], seed: number) {
  const unique = [answer, ...distractors.filter((value) => value !== answer)].filter((value, index, all) => all.indexOf(value) === index).slice(0, 4);
  const offset = seed % unique.length;
  return [...unique.slice(offset), ...unique.slice(0, offset)];
}

function base(overrides: Partial<Question> & Pick<Question, "id" | "subject" | "skill" | "subSkill" | "prompt" | "answer" | "options" | "solution" | "explanation">): Question {
  return { difficulty: 2, grade: "5e", estimatedSeconds: 75, tags: ["PFEQ", "admission", overrides.skill], ...overrides };
}

function mathQuestions(): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < 40; i += 1) {
    const a = 126 + i * 7;
    const b = 39 + i * 3;
    const answer = String(a + b);
    questions.push(base({ id: `math-op-${i + 1}`, subject: "Mathématiques", skill: "Opérations", subSkill: "Addition et estimation", prompt: `Une collecte a reçu ${a} livres lundi et ${b} mardi. Combien de livres ont été reçus au total?`, answer, options: rotated(answer, [String(a + b + 10), String(a + b - 10), String(a - b)], i), solution: `${a} + ${b} = ${answer}`, explanation: "On additionne les deux quantités parce qu’on cherche le total des livres reçus.", difficulty: i < 12 ? 1 : i < 30 ? 2 : 3, estimatedSeconds: 60 }));
  }
  for (let i = 0; i < 40; i += 1) {
    const numerator = 1 + (i % 5);
    const denominator = numerator + 3 + (i % 4);
    const multiplier = 2 + (i % 3);
    const answer = `${numerator * multiplier}/${denominator * multiplier}`;
    questions.push(base({ id: `math-frac-${i + 1}`, subject: "Mathématiques", skill: "Fractions", subSkill: "Fractions équivalentes", prompt: `Quelle fraction est équivalente à ${numerator}/${denominator}?`, answer, options: rotated(answer, [`${numerator * multiplier}/${denominator * multiplier + 1}`, `${numerator * multiplier + 1}/${denominator * multiplier}`, `${numerator}/${denominator * multiplier}`], i + 1), solution: `${numerator}/${denominator} × ${multiplier}/${multiplier} = ${answer}`, explanation: "Une fraction reste équivalente lorsqu’on multiplie son numérateur et son dénominateur par le même nombre.", difficulty: i < 10 ? 1 : i < 28 ? 2 : 3 }));
  }
  for (let i = 0; i < 40; i += 1) {
    const price = 4.25 + i * 0.35;
    const answer = (price * 2).toFixed(2).replace(".", ",") + " $";
    questions.push(base({ id: `math-dec-${i + 1}`, subject: "Mathématiques", skill: "Nombres décimaux", subSkill: "Monnaie et multiplication", prompt: `Deux cahiers coûtent chacun ${price.toFixed(2).replace(".", ",")} $. Quel est le coût total?`, answer, options: rotated(answer, [(price + 2).toFixed(2).replace(".", ",") + " $", (price * 2 + 1).toFixed(2).replace(".", ",") + " $", (price * 3).toFixed(2).replace(".", ",") + " $"], i + 2), solution: `${price.toFixed(2).replace(".", ",")} × 2 = ${answer}`, explanation: "On multiplie le prix d’un cahier par le nombre de cahiers.", difficulty: i < 12 ? 1 : 2, estimatedSeconds: 75 }));
  }
  for (let i = 0; i < 40; i += 1) {
    const length = 5 + (i % 11);
    const width = 3 + (i % 5);
    const perimeter = 2 * (length + width);
    const answer = `${perimeter} cm`;
    questions.push(base({ id: `math-geo-${i + 1}`, subject: "Mathématiques", skill: "Mesure et géométrie", subSkill: "Périmètre", prompt: `Un rectangle mesure ${length} cm de longueur et ${width} cm de largeur. Quel est son périmètre?`, answer, options: rotated(answer, [`${perimeter + 2} cm`, `${perimeter - 2} cm`, `${length * width} cm²`], i + 3), solution: `2 × (${length} + ${width}) = ${perimeter} cm`, explanation: "Le périmètre est la longueur du contour : deux longueurs et deux largeurs.", difficulty: i < 10 ? 1 : i < 30 ? 2 : 3, estimatedSeconds: 90 }));
  }
  return questions;
}

function frenchQuestions(): Question[] {
  const questions: Question[] = [];
  const nouns = [["renard", "curieux", "renards curieux"], ["maison", "bleue", "maisons bleues"], ["cheval", "rapide", "chevaux rapides"], ["journal", "local", "journaux locaux"], ["oiseau", "coloré", "oiseaux colorés"], ["activité", "amusante", "activités amusantes"], ["travail", "original", "travaux originaux"], ["bateau", "léger", "bateaux légers"]];
  for (let i = 0; i < 40; i += 1) {
    const [noun, adjective, plural] = nouns[i % nouns.length];
    const answer = `des ${plural}`;
    questions.push(base({ id: `fr-accord-${i + 1}`, subject: "Français", skill: "Grammaire", subSkill: "Accord dans le groupe du nom", prompt: `Mets au pluriel le groupe « un ${noun} ${adjective} » (${i + 1}).`, answer, options: rotated(answer, [`un ${plural}`, `des ${noun} ${adjective}`, `des ${noun} ${adjective}s`], i), solution: `un ${noun} ${adjective} → ${answer}`, explanation: "Le déterminant, le nom et l’adjectif s’accordent en genre et en nombre. Attention aux pluriels particuliers.", difficulty: i < 10 ? 1 : 2, estimatedSeconds: 55 }));
  }
  const objects = ["livres", "crayons", "patins", "photos", "notes", "cartes", "souvenirs", "outils"];
  for (let i = 0; i < 40; i += 1) {
    const object = objects[i % objects.length];
    const answer = "ses";
    questions.push(base({ id: `fr-homo-${i + 1}`, subject: "Français", skill: "Orthographe", subSkill: "Homophones grammaticaux", prompt: `Lina range ___ ${object} dans son casier avant de partir.`, answer, options: rotated(answer, ["ces", "c’est", "s’est"], i + 1), solution: `Lina range ses ${object}.`, explanation: "« Ses » est un déterminant possessif : les objets appartiennent à Lina.", difficulty: i < 15 ? 1 : 2, estimatedSeconds: 45 }));
  }
  const synonyms = [["rapide", "vite"], ["heureux", "joyeux"], ["difficile", "complexe"], ["observer", "regarder"], ["débuter", "commencer"], ["calme", "paisible"], ["brillant", "lumineux"], ["minuscule", "très petit"], ["terminer", "finir"], ["courageux", "brave"]];
  for (let i = 0; i < 40; i += 1) {
    const [word, answer] = synonyms[i % synonyms.length];
    questions.push(base({ id: `fr-vocab-${i + 1}`, subject: "Français", skill: "Vocabulaire", subSkill: "Synonymes", prompt: `Quel mot a un sens proche de « ${word} » dans une phrase courante?`, answer, options: rotated(answer, ["contraire", "immobile", "lointain"], i + 2), solution: `${word} ≈ ${answer}`, explanation: "Des synonymes sont des mots de sens proche; le contexte permet de choisir le mot le plus juste.", difficulty: i < 15 ? 1 : 2, estimatedSeconds: 50 }));
  }
  const verbs = [["finir", "finissons"], ["choisir", "choisissons"], ["prendre", "prenons"], ["faire", "faisons"], ["aller", "allons"], ["voir", "voyons"], ["réussir", "réussissons"], ["venir", "venons"]];
  for (let i = 0; i < 40; i += 1) {
    const [verb, answer] = verbs[i % verbs.length];
    questions.push(base({ id: `fr-conj-${i + 1}`, subject: "Français", skill: "Conjugaison", subSkill: "Présent de l’indicatif", prompt: `Complète au présent : « Nous ___ notre défi. » (verbe ${verb})`, answer, options: rotated(answer, [`${verb}ons`, `${verb}ez`, `${verb}ent`], i + 3), solution: `Nous ${answer} notre défi.`, explanation: "Le verbe est conjugué avec le pronom « nous » au présent de l’indicatif.", difficulty: i < 12 ? 1 : 2, estimatedSeconds: 55 }));
  }
  return questions;
}

function logicQuestions(): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < 30; i += 1) {
    const start = 2 + i;
    const step = 2 + (i % 6);
    const next = start + step * 4;
    const answer = String(next);
    questions.push(base({ id: `logic-seq-${i + 1}`, subject: "Logique", skill: "Suites", subSkill: "Régularité numérique", prompt: `Complète la suite : ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, …`, answer, options: rotated(answer, [String(next + step), String(next - 1), String(next + 1)], i), solution: `On ajoute ${step} à chaque terme; le suivant est ${next}.`, explanation: "Compare deux nombres voisins pour trouver l’écart constant, puis applique la même règle.", difficulty: i < 10 ? 1 : 2, estimatedSeconds: 60 }));
  }
  const groups = [["pomme", "poire", "banane", "carotte"], ["carré", "triangle", "cercle", "violon"], ["janvier", "mars", "juillet", "lundi"], ["rouge", "bleu", "vert", "chaise"], ["chat", "chien", "lapin", "érable"]];
  for (let i = 0; i < 15; i += 1) {
    const items = groups[i % groups.length];
    const answer = items[3];
    questions.push(base({ id: `logic-class-${i + 1}`, subject: "Logique", skill: "Classification", subSkill: "Repérage d’intrus", prompt: `Quel mot n’appartient pas au même groupe : ${items.join(", ")}?`, answer, options: rotated(answer, items.slice(0, 3), i + 1), solution: `${answer} est l’intrus.`, explanation: "Les trois autres mots partagent une catégorie commune; l’intrus appartient à une autre catégorie.", difficulty: 1, estimatedSeconds: 45 }));
  }
  const analogies = [["oiseau", "nid", "abeille", "ruche"], ["poisson", "eau", "oiseau", "air"], ["crayon", "écrire", "ciseaux", "couper"], ["matin", "déjeuner", "soir", "souper"], ["main", "gant", "pied", "chaussette"]];
  for (let i = 0; i < 15; i += 1) {
    const [a, b, c, answer] = analogies[i % analogies.length];
    questions.push(base({ id: `logic-ana-${i + 1}`, subject: "Logique", skill: "Analogies", subSkill: "Relations", prompt: `${a} est à ${b} ce que ${c} est à…`, answer, options: rotated(answer, [a, b, c], i + 2), solution: `${a} → ${b}; ${c} → ${answer}.`, explanation: "On identifie la relation entre les deux premiers mots et on applique la même relation aux deux suivants.", difficulty: 2, estimatedSeconds: 60 }));
  }
  return questions;
}

function englishQuestions(): Question[] {
  const questions: Question[] = [];
  const items = [["library", "books"], ["bakery", "bread"], ["garden", "flowers"], ["museum", "art"], ["school", "students"], ["kitchen", "meals"], ["forest", "trees"], ["farm", "animals"], ["airport", "planes"], ["hospital", "doctors"]];
  for (let i = 0; i < 30; i += 1) {
    const [place, answer] = items[i % items.length];
    questions.push(base({ id: `en-vocab-${i + 1}`, subject: "Anglais", skill: "Vocabulary", subSkill: "Context clues", prompt: `Complete the sentence: “At the ${place}, you can find many ___.”`, answer, options: rotated(answer, ["clouds", "pencils", "rivers"], i), solution: `At the ${place}, you can find many ${answer}.`, explanation: "The place named in the sentence gives a clue about the most logical noun.", difficulty: 1, estimatedSeconds: 45 }));
  }
  const verbs = [["play", "plays"], ["read", "reads"], ["walk", "walks"], ["study", "studies"], ["watch", "watches"], ["carry", "carries"], ["finish", "finishes"], ["go", "goes"]];
  for (let i = 0; i < 30; i += 1) {
    const [verb, answer] = verbs[i % verbs.length];
    questions.push(base({ id: `en-grammar-${i + 1}`, subject: "Anglais", skill: "Grammar", subSkill: "Simple present", prompt: `Choose the correct form: “My friend ___ after school.” (${verb})`, answer, options: rotated(answer, [verb, `${verb}ing`, `${verb}ed`], i + 1), solution: `My friend ${answer} after school.`, explanation: "In the simple present, a third-person singular subject usually takes -s or -es.", difficulty: i < 12 ? 1 : 2, estimatedSeconds: 50 }));
  }
  return questions;
}

export const QUESTION_BANK: Question[] = [...mathQuestions(), ...frenchQuestions(), ...logicQuestions(), ...englishQuestions()];

export function questionsFor(subjects: Question["subject"][], count: number, offset = 0) {
  const pool = QUESTION_BANK.filter((question) => subjects.includes(question.subject));
  return Array.from({ length: Math.min(count, pool.length) }, (_, index) => pool[(index * 17 + offset * 7) % pool.length]);
}

export function validateQuestionBank() {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const question of QUESTION_BANK) {
    if (!question.id || !question.prompt || !question.answer || !question.solution || !question.explanation) errors.push(`${question.id || "sans-id"}: champ obligatoire manquant`);
    if (ids.has(question.id)) errors.push(`${question.id}: identifiant dupliqué`);
    ids.add(question.id);
    if (!question.options.includes(question.answer)) errors.push(`${question.id}: réponse absente des options`);
    if (new Set(question.options).size !== question.options.length) errors.push(`${question.id}: options dupliquées`);
    if (question.options.length < 4) errors.push(`${question.id}: moins de quatre options`);
  }
  return errors;
}
