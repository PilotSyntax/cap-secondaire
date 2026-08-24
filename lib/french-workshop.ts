import type { Question } from "./app-data";

export type FrenchActivityCategory = "Conjugaison" | "Orthographe" | "Correction" | "Dictée";

export type FrenchActivity = {
  id: string;
  category: FrenchActivityCategory;
  skill: string;
  focus: string;
  instruction: string;
  prompt: string;
  answer: string;
  explanation: string;
  hint: string;
  difficulty: 1 | 2 | 3;
};

export const FRENCH_CATEGORY_INFO: Array<{ id: FrenchActivityCategory; symbol: string; title: string; description: string; duration: string }> = [
  { id: "Conjugaison", symbol: "Je", title: "Conjugaison express", description: "Présent, imparfait et futur simple avec les verbes essentiels.", duration: "8 questions · 10 min" },
  { id: "Orthographe", symbol: "à", title: "Orthographe et homophones", description: "Choisir le bon mot selon le sens de la phrase.", duration: "8 questions · 8 min" },
  { id: "Correction", symbol: "✓", title: "Détective des erreurs", description: "Réécrire une phrase en corrigeant ses accords et ses verbes.", duration: "8 phrases · 12 min" },
  { id: "Dictée", symbol: "♫", title: "Mini-dictées audio", description: "Écouter, écrire, puis comparer avec la phrase correcte.", duration: "8 phrases · 10 min" },
];

const SUBJECTS = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];
const VERBS = [
  { infinitive: "être", present: ["suis", "es", "est", "sommes", "êtes", "sont"], imperfect: ["étais", "étais", "était", "étions", "étiez", "étaient"], future: ["serai", "seras", "sera", "serons", "serez", "seront"] },
  { infinitive: "avoir", present: ["ai", "as", "a", "avons", "avez", "ont"], imperfect: ["avais", "avais", "avait", "avions", "aviez", "avaient"], future: ["aurai", "auras", "aura", "aurons", "aurez", "auront"] },
  { infinitive: "aller", present: ["vais", "vas", "va", "allons", "allez", "vont"], imperfect: ["allais", "allais", "allait", "allions", "alliez", "allaient"], future: ["irai", "iras", "ira", "irons", "irez", "iront"] },
  { infinitive: "faire", present: ["fais", "fais", "fait", "faisons", "faites", "font"], imperfect: ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"], future: ["ferai", "feras", "fera", "ferons", "ferez", "feront"] },
  { infinitive: "prendre", present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"], imperfect: ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"], future: ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"] },
  { infinitive: "venir", present: ["viens", "viens", "vient", "venons", "venez", "viennent"], imperfect: ["venais", "venais", "venait", "venions", "veniez", "venaient"], future: ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"] },
  { infinitive: "finir", present: ["finis", "finis", "finit", "finissons", "finissez", "finissent"], imperfect: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"], future: ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"] },
  { infinitive: "choisir", present: ["choisis", "choisis", "choisit", "choisissons", "choisissez", "choisissent"], imperfect: ["choisissais", "choisissais", "choisissait", "choisissions", "choisissiez", "choisissaient"], future: ["choisirai", "choisiras", "choisira", "choisirons", "choisirez", "choisiront"] },
] as const;

const TENSES = [
  { key: "present", label: "présent", rule: "Le présent exprime une action qui se déroule maintenant ou une habitude." },
  { key: "imperfect", label: "imparfait", rule: "À l’imparfait, on utilise le radical de « nous » au présent et les terminaisons -ais, -ais, -ait, -ions, -iez, -aient." },
  { key: "future", label: "futur simple", rule: "Au futur simple, on ajoute généralement -ai, -as, -a, -ons, -ez, -ont au radical du futur." },
] as const;

function conjugationActivities(): FrenchActivity[] {
  return VERBS.flatMap((verb, verbIndex) => TENSES.map((tense, tenseIndex) => {
    const subjectIndex = (verbIndex + tenseIndex * 2) % SUBJECTS.length;
    const answer = verb[tense.key][subjectIndex];
    return {
      id: `conj-${verb.infinitive}-${tense.key}`,
      category: "Conjugaison" as const,
      skill: "Conjugaison",
      focus: `${verb.infinitive} · ${tense.label}`,
      instruction: "Écris seulement le verbe conjugué.",
      prompt: `Conjugue « ${verb.infinitive} » au ${tense.label} avec « ${SUBJECTS[subjectIndex]} » : ${SUBJECTS[subjectIndex]} ___`,
      answer,
      explanation: `${SUBJECTS[subjectIndex]} ${answer}. ${tense.rule}`,
      hint: `Observe le sujet « ${SUBJECTS[subjectIndex]} » et pense à la terminaison du ${tense.label}.`,
      difficulty: tenseIndex === 0 ? 1 : tenseIndex === 1 ? 2 : 3,
    };
  }));
}

const ORTHOGRAPHY_DATA = [
  ["Elle ___ un nouveau cahier.", "a", "« A » est le verbe avoir; on peut le remplacer par « avait »."],
  ["Camille va ___ la bibliothèque.", "à", "« À » est une préposition qui introduit ici un lieu."],
  ["Le ciel ___ bleu aujourd’hui.", "est", "« Est » est le verbe être; on peut le remplacer par « était »."],
  ["Nora ___ Mina préparent leur sac.", "et", "« Et » relie deux mots; on peut le remplacer par « et puis »."],
  ["Les élèves ___ terminé leur travail.", "ont", "« Ont » est le verbe avoir; on peut le remplacer par « avaient »."],
  ["___ écoute la consigne avant de répondre.", "On", "« On » est un pronom personnel; on peut le remplacer par « il »."],
  ["Les enfants ___ prêts pour l’activité.", "sont", "« Sont » est le verbe être; on peut le remplacer par « étaient »."],
  ["Malik range ___ cahiers dans son sac.", "ses", "« Ses » est un déterminant possessif : les cahiers lui appartiennent."],
  ["___ exercices sont plus difficiles.", "Ces", "« Ces » est un déterminant démonstratif : il montre les exercices."],
  ["Elle ___ lavé les mains avant le repas.", "s’est", "« S’est » accompagne ici le verbe pronominal « se laver »."],
  ["___ une excellente stratégie.", "C’est", "« C’est » signifie ici « cela est »."],
  ["___ veux-tu placer cette affiche?", "Où", "« Où » avec un accent indique un lieu."],
  ["Préfères-tu lire ___ dessiner?", "ou", "« Ou » sans accent présente un choix."],
  ["Le professeur ___ donne un conseil.", "leur", "« Leur » devant un verbe est un pronom et reste invariable."],
  ["Les filles rangent ___ livres.", "leurs", "« Leurs » s’accorde avec le nom pluriel « livres »."],
  ["Je comprends la règle, ___ je dois encore pratiquer.", "mais", "« Mais » marque une opposition; « mes » exprimerait la possession."],
] as const;

function orthographyActivities(): FrenchActivity[] {
  return ORTHOGRAPHY_DATA.map(([prompt, answer, explanation], index) => ({
    id: `ortho-${index + 1}`,
    category: "Orthographe",
    skill: "Orthographe",
    focus: "Homophones et mots fréquents",
    instruction: "Complète la phrase avec le mot correctement orthographié.",
    prompt,
    answer,
    explanation,
    hint: "Essaie de remplacer le mot par un autre pour vérifier sa fonction dans la phrase.",
    difficulty: index < 6 ? 1 : index < 12 ? 2 : 3,
  }));
}

const CORRECTION_DATA = [
  ["Les petit chiens blanc jouent dans la cour.", "Les petits chiens blancs jouent dans la cour.", "Le déterminant, le nom et les adjectifs sont au masculin pluriel."],
  ["Vous faite vos devoirs avec attention.", "Vous faites vos devoirs avec attention.", "Au présent, le verbe faire avec « vous » s’écrit « faites »."],
  ["Ils prenne le même autobus chaque matin.", "Ils prennent le même autobus chaque matin.", "Au présent, le verbe prendre avec « ils » s’écrit « prennent »."],
  ["J’ai manger une pomme après l’école.", "J’ai mangé une pomme après l’école.", "Après l’auxiliaire avoir, on écrit le participe passé « mangé »."],
  ["Les enfants sont aller au gymnase.", "Les enfants sont allés au gymnase.", "Avec l’auxiliaire être, le participe passé s’accorde avec le sujet masculin pluriel."],
  ["Ces fille courageuse terminent la course.", "Ces filles courageuses terminent la course.", "Le nom et l’adjectif s’accordent au féminin pluriel."],
  ["Ont prépare notre matériel maintenant.", "On prépare notre matériel maintenant.", "« On » est le pronom sujet; « ont » est le verbe avoir."],
  ["Léa et Mina son déjà arrivées.", "Léa et Mina sont déjà arrivées.", "« Sont » est le verbe être au pluriel."],
  ["Tu choisi un livre à la bibliothèque.", "Tu choisis un livre à la bibliothèque.", "Au présent, choisir avec « tu » se termine par -is."],
  ["Les chevals galopent dans le champ.", "Les chevaux galopent dans le champ.", "Le pluriel particulier de « cheval » est « chevaux »."],
  ["Cette arbre est très vieux.", "Cet arbre est très vieux.", "Devant un nom masculin qui commence par une voyelle, on emploie « cet »."],
  ["Mes amis joue dehors après la classe.", "Mes amis jouent dehors après la classe.", "Le verbe s’accorde avec le sujet pluriel « mes amis »."],
] as const;

function correctionActivities(): FrenchActivity[] {
  return CORRECTION_DATA.map(([prompt, answer, explanation], index) => ({
    id: `correction-${index + 1}`,
    category: "Correction",
    skill: index % 3 === 0 ? "Conjugaison" : "Orthographe",
    focus: index % 3 === 0 ? "Terminaisons verbales" : "Accords et homophones",
    instruction: "Réécris toute la phrase en corrigeant l’erreur.",
    prompt,
    answer,
    explanation,
    hint: "Repère d’abord le sujet et le verbe, puis vérifie les accords dans chaque groupe du nom.",
    difficulty: index < 4 ? 1 : index < 9 ? 2 : 3,
  }));
}

const DICTATION_DATA = [
  ["Les jeunes exploratrices préparent leurs cahiers.", "Le déterminant, le nom, l’adjectif et le verbe s’accordent au pluriel."],
  ["Nous finirons notre projet avant vendredi.", "Le verbe finir est conjugué au futur simple avec « nous »."],
  ["Ces oiseaux colorés volaient au-dessus du jardin.", "« Ces » montre les oiseaux; le nom et l’adjectif sont au pluriel."],
  ["On a choisi une stratégie efficace.", "« On » est le sujet et « a » est l’auxiliaire avoir."],
  ["Vous faites attention aux consignes importantes.", "Le verbe faire avec « vous » s’écrit « faites » au présent."],
  ["Les élèves sont arrivés tôt à la bibliothèque.", "Avec être, « arrivés » s’accorde avec le sujet masculin pluriel."],
  ["J’irai chercher mes nouveaux livres demain.", "Le verbe aller devient « irai » au futur simple avec « je »."],
  ["Leur enseignante leur explique où placer leurs réponses.", "« Leur » pronom est invariable; « leurs » déterminant s’accorde avec « réponses »."],
] as const;

function dictationActivities(): FrenchActivity[] {
  return DICTATION_DATA.map(([sentence, explanation], index) => ({
    id: `dictee-${index + 1}`,
    category: "Dictée",
    skill: "Orthographe",
    focus: "Dictée de phrase",
    instruction: "Écoute la phrase, puis écris-la au complet. La ponctuation finale est facultative.",
    prompt: sentence,
    answer: sentence,
    explanation,
    hint: "Réécoute lentement et repère les groupes de mots avant d’écrire.",
    difficulty: index < 2 ? 1 : index < 6 ? 2 : 3,
  }));
}

export const FRENCH_ACTIVITIES: FrenchActivity[] = [
  ...conjugationActivities(),
  ...orthographyActivities(),
  ...correctionActivities(),
  ...dictationActivities(),
];

export function activitiesFor(category: FrenchActivityCategory, count = 8, offset = 0) {
  const pool = FRENCH_ACTIVITIES.filter((activity) => activity.category === category);
  return Array.from({ length: Math.min(count, pool.length) }, (_, index) => pool[(index * 5 + offset * 3) % pool.length]);
}

export function normalizeFrenchAnswer(value: string) {
  return value.trim().replace(/[.!?]+$/u, "").replace(/[’`]/gu, "'").replace(/\s+/gu, " ").toLocaleLowerCase("fr-CA");
}

export function activityToQuestion(activity: FrenchActivity): Question {
  return {
    id: activity.id,
    subject: "Français",
    skill: activity.skill,
    subSkill: activity.focus,
    difficulty: activity.difficulty,
    grade: "6e",
    prompt: activity.prompt,
    options: [activity.answer, "Réponse libre A", "Réponse libre B", "Réponse libre C"],
    answer: activity.answer,
    solution: activity.answer,
    explanation: activity.explanation,
    estimatedSeconds: activity.category === "Correction" ? 120 : 75,
    tags: ["PFEQ", "français", activity.category],
  };
}
