export type Subject = "Français" | "Mathématiques" | "Logique" | "Anglais";

export type Question = {
  id: string;
  subject: Subject;
  skill: string;
  subSkill: string;
  difficulty: 1 | 2 | 3 | 4;
  grade: "4e" | "5e" | "6e";
  prompt: string;
  options: string[];
  answer: string;
  solution: string;
  explanation: string;
  estimatedSeconds: number;
  tags: string[];
};

export type School = {
  id: string;
  name: string;
  location: string;
  process: string;
  examDate: string | null;
  secondaryExamDate?: string | null;
  applicationDeadline: string | null;
  openHouseDate?: string | null;
  subjects: string[];
  duration: string;
  recordImportance: string;
  status: string;
  verified: boolean;
  verifiedAt: string;
  source: string;
  notes: string;
};

export type SkillMastery = { id: string; subject: Subject; label: string; score: number; trend: number };
export type ErrorEntry = { id: string; question: string; given: string; answer: string; skill: string; explanation: string; date: string; occurrences: number };

export type AppState = {
  dataVersion: number;
  student: { name: string; grade: string; dailyTarget: number; xp: number; streak: number; weeklyMinutes: number };
  selectedSchoolIds: string[];
  schoolStatuses: Record<string, string>;
  schoolDateOverrides: Record<string, string>;
  customSchools: School[];
  mastery: SkillMastery[];
  errors: ErrorEntry[];
  completedQuestions: number;
  correctAnswers: number;
  diagnosticComplete: boolean;
  lastUpdated: string;
};

export const SCHOOLS: School[] = [
  {
    id: "lafontaine", name: "Académie Lafontaine", location: "Saint-Jérôme", process: "Examen d’admission", examDate: "2026-09-19", applicationDeadline: "2026-09-06", subjects: [], duration: "À confirmer auprès de l’établissement", recordImportance: "À confirmer auprès de l’établissement", status: "À considérer", verified: false, verifiedAt: "2026-08-23", source: "https://www.academielafontaine.qc.ca/admission/", notes: "Date, matières et durée à confirmer directement auprès de l’établissement.",
  },
  {
    id: "ste-therese", name: "Académie Sainte-Thérèse", location: "Sainte-Thérèse", process: "Étude du dossier, sans examen d’admission", examDate: null, applicationDeadline: "2026-09-15", openHouseDate: "2026-09-12", subjects: [], duration: "Sans examen", recordImportance: "Bulletins des deux dernières années", status: "Inscription à faire", verified: true, verifiedAt: "2026-08-23", source: "https://www.academie.ste-therese.com/admission-procedure-inscription/", notes: "Annonce des décisions autour du 21 septembre 2026.",
  },
  {
    id: "externat", name: "Externat Sacré-Cœur", location: "Rosemère", process: "Tests d’admission", examDate: "2026-09-26", secondaryExamDate: "2026-09-27", applicationDeadline: null, subjects: [], duration: "À confirmer auprès de l’établissement", recordImportance: "À confirmer auprès de l’établissement", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://www.externat.qc.ca/demarche-admission", notes: "Sessions annoncées les 26 et 27 septembre 2026. Matières et durée non publiées sur la page consultée.",
  },
  {
    id: "saint-sacrement", name: "Collège Saint-Sacrement", location: "Terrebonne", process: "Étude du dossier, puis examen au besoin", examDate: "2026-09-26", secondaryExamDate: "2026-09-27", applicationDeadline: "2026-09-26", subjects: ["Français", "Mathématiques"], duration: "À confirmer auprès de l’établissement", recordImportance: "Exemption possible pour les meilleurs dossiers", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://collegesaintsacrement.qc.ca/procedures-admission/", notes: "Les candidatures déposées avant le 1er septembre sont d’abord étudiées pour une admission sans examen.",
  },
  {
    id: "regina", name: "Collège Regina Assumpta", location: "Montréal", process: "Étude du dossier, sans examen d’admission", examDate: null, applicationDeadline: null, openHouseDate: "2026-09-12", subjects: [], duration: "Sans examen", recordImportance: "Dossier scolaire analysé", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://reginaassumpta.qc.ca/admission/", notes: "La date limite 2027-2028 n’était pas publiée sur la page consultée.",
  },
  {
    id: "brebeuf", name: "Collège Jean-de-Brébeuf", location: "Montréal", process: "Examen d’admission", examDate: "2026-09-26", secondaryExamDate: "2026-09-27", applicationDeadline: null, subjects: ["Mathématiques et logique", "Français"], duration: "2 h à 3 h, pauses comprises", recordImportance: "Résultats d’examen prioritaires; bulletin de validation", status: "Inscription faite", verified: true, verifiedAt: "2026-08-23", source: "https://www.brebeuf.qc.ca/secondaire/foire-aux-questions-pour-ladmission-2026-2027/", notes: "35 min de mathématiques/logique et 90 min de français. Les habiletés de 5e année sont évaluées.",
  },
  {
    id: "loyola", name: "Loyola High School", location: "Montréal", process: "Étude du dossier, entrevue et Activity Day", examDate: "2026-10-17", applicationDeadline: "2026-09-28", openHouseDate: "2026-09-19", subjects: ["Communication en anglais"], duration: "À confirmer auprès de l’établissement", recordImportance: "Bulletins, entrevue et dossier global", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://loyola.ca/admissions/faq", notes: "Aucun examen formel. Un certificat d’admissibilité à l’enseignement en anglais est généralement requis.",
  },
  {
    id: "laval", name: "Collège Laval", location: "Laval", process: "Examens d’admission", examDate: "2026-09-19", secondaryExamDate: "2026-09-20", applicationDeadline: "2026-09-17", openHouseDate: "2026-09-12", subjects: ["Français", "Mathématiques"], duration: "À confirmer auprès de l’établissement", recordImportance: "Aucun bulletin requis; résultats d’examen", status: "Examen planifié", verified: true, verifiedAt: "2026-08-23", source: "https://collegelaval.ca/admission/", notes: "Programme de 5e année. Pondération publiée : 60 % français, 40 % mathématiques.",
  },
  {
    id: "letendre", name: "Collège Letendre", location: "Laval", process: "Étude du dossier, puis examen au besoin", examDate: "2026-09-26", applicationDeadline: null, openHouseDate: "2026-09-12", subjects: ["Français", "Mathématiques"], duration: "Français 45 min; mathématiques 40 min", recordImportance: "Bulletins de 4e et 5e; exemption possible à 90 % et plus", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://www.collegeletendre.qc.ca/admission/", notes: "Deux séances annoncées à 8 h et 12 h 30.",
  },
  {
    id: "citoyen", name: "Collège Citoyen", location: "Laval", process: "Concours d’admission et atelier de leadership", examDate: "2026-09-26", applicationDeadline: null, openHouseDate: "2026-09-12", subjects: ["Français", "Mathématiques", "Leadership"], duration: "2 h 30 accueil compris; 60 min d’épreuves et 30 min d’atelier", recordImportance: "Poids égal entre bulletin et concours", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://www.collegecitoyen.ca/admission-en-ligne/", notes: "Français : compréhension, lecture et grammaire. Mathématiques : arithmétique, probabilités et géométrie.",
  },
  {
    id: "boisbriand", name: "Collège Boisbriand", location: "Boisbriand", process: "Étude du dossier scolaire", examDate: null, applicationDeadline: null, openHouseDate: "2026-09-19", subjects: [], duration: "Sans examen publié", recordImportance: "Bulletin courant et bulletin final précédent", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://collegeboisbriand.qc.ca/procedure-dadmission/", notes: "Priorité d’étude selon le principe du premier inscrit, premier admis.",
  },
  {
    id: "laurentien", name: "Collège Laurentien", location: "Val-Morin", process: "Étude du dossier et tests d’entrée", examDate: null, applicationDeadline: null, subjects: ["Français", "Mathématiques"], duration: "À confirmer auprès de l’établissement", recordImportance: "Bulletins des deux dernières années, puis tests", status: "À considérer", verified: true, verifiedAt: "2026-08-23", source: "https://www.collegelaurentien.ca/procedure-admission/secondaire/", notes: "La date 2027-2028 n’était pas publiée sur la page consultée.",
  },
];

export const CURRENT_DATA_VERSION = 2;

export const DEFAULT_STATE: AppState = {
  dataVersion: CURRENT_DATA_VERSION,
  student: { name: "Élève", grade: "6e année", dailyTarget: 35, xp: 0, streak: 0, weeklyMinutes: 0 },
  selectedSchoolIds: [],
  schoolStatuses: {},
  schoolDateOverrides: {},
  customSchools: [],
  mastery: [
    { id: "reading", subject: "Français", label: "Compréhension implicite", score: 0, trend: 0 },
    { id: "fractions", subject: "Mathématiques", label: "Fractions", score: 0, trend: 0 },
    { id: "grammar", subject: "Français", label: "Accords dans le GN", score: 0, trend: 0 },
    { id: "conjugation", subject: "Français", label: "Conjugaison", score: 0, trend: 0 },
    { id: "spelling", subject: "Français", label: "Orthographe et homophones", score: 0, trend: 0 },
    { id: "problems", subject: "Mathématiques", label: "Problèmes à étapes", score: 0, trend: 0 },
    { id: "logic", subject: "Logique", label: "Déduction", score: 0, trend: 0 },
    { id: "english", subject: "Anglais", label: "Reading & vocabulary", score: 0, trend: 0 },
  ],
  errors: [],
  completedQuestions: 0,
  correctAnswers: 0,
  diagnosticComplete: false,
  lastUpdated: "2026-08-23T00:00:00-04:00",
};

export const READING_TEXTS = [
  { id: "text-1", title: "Le jardin sur le toit", type: "informatif", text: "Au printemps, l’école du quartier a transformé son toit gris en jardin. Les élèves ont mesuré les bacs, choisi des plantes adaptées au soleil et installé un système qui récupère l’eau de pluie. En juin, les laitues ont été partagées avec une cuisine communautaire. Le projet a aussi réduit la chaleur dans les classes du dernier étage." },
  { id: "text-2", title: "La carte oubliée", type: "narratif", text: "Mina rangeait le grenier lorsqu’elle trouva une carte pliée dans un vieux livre. Un cercle rouge entourait le grand chêne du parc. Le lendemain, elle s’y rendit avec son frère. Sous une pierre plate, ils découvrirent une boîte remplie de lettres que leur grand-père avait écrites à leur âge." },
  { id: "text-3", title: "Pourquoi les oies voyagent en V", type: "informatif", text: "En volant en V, les oies profitent de l’air déplacé par celles qui les précèdent. Cette organisation leur permet d’économiser de l’énergie. L’oie de tête se fatigue davantage; elle échange donc régulièrement sa place avec une autre. La coopération aide tout le groupe à parcourir de longues distances." },
  { id: "text-4", title: "Le défi de Nora", type: "narratif", text: "Nora croyait ne jamais réussir à réparer son vélo. Elle observa d’abord la chaîne, consulta le guide et demanda un outil à sa voisine. Après deux essais, la chaîne se remit en place. Nora rentra chez elle les mains noires, mais le sourire immense." },
  { id: "text-5", title: "Une bibliothèque d’objets", type: "informatif", text: "Certaines bibliothèques prêtent maintenant des outils, des jeux et même des instruments de musique. Ce service permet aux familles d’essayer un objet avant de l’acheter et évite que des appareils peu utilisés dorment dans les placards. Le partage réduit aussi la quantité de déchets." },
];

export const WRITING_ACTIVITIES = [
  "Raconte une situation où tu as persévéré malgré une difficulté.",
  "Explique comment rendre la cour d’école plus écologique.",
  "Écris la suite du récit « La carte oubliée » en trois paragraphes.",
  "Présente une activité que tu aimerais faire découvrir à ta classe.",
  "Rédige une courte lettre à ton futur toi de première secondaire.",
];
