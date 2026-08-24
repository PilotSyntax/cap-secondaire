"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppState, Question, Subject } from "../../lib/app-data";
import { buildExamQuestions, EXAM_CATEGORIES, EXAM_LIBRARY, type ExamCategory, type ExamDefinition } from "../../lib/exam-library";
import { questionsFor } from "../../lib/question-bank";
import type { MissionMode } from "./cap-secondaire-app";

type AnswerRecorder = (question: Question, correct: boolean, given: string, seconds: number) => void;

export function MissionView({ mode, state, onAnswer, onComplete, onBack }: { mode: MissionMode; state: AppState; onAnswer: AnswerRecorder; onComplete: (correct: number, total: number) => void; onBack: () => void }) {
  const [started, setStarted] = useState(mode === "smart");
  const subjects: Subject[] = mode === "diagnostic" ? ["Français", "Mathématiques", "Logique", "Anglais"] : ["Mathématiques", "Français"];
  const count = mode === "diagnostic" ? 24 : 7;
  const [questions] = useState(() => questionsFor(subjects, count, mode === "diagnostic" ? 9 : state.completedQuestions));

  if (!started) {
    return <section className="section-view"><div className="intro-grid"><article className="card intro-card"><div className="large-icon" aria-hidden="true">🧭</div><p className="eyebrow">Mon diagnostic</p><h2>Découvrons ton point de départ</h2><p>24 questions adaptatives couvrent le français, les mathématiques, la logique et l’anglais. Tu peux t’arrêter et reprendre plus tard; aucune correction ne sera affichée avant la fin.</p><div className="info-chips"><span>◷ 45 à 60 min</span><span>▤ 4 matières</span><span>✓ Sauvegarde automatique</span></div><button type="button" className="primary-button" onClick={() => setStarted(true)}>Démarrer mon diagnostic →</button></article><article className="card panel strategy-card"><h3>Avant de commencer</h3><ol><li>Installe-toi dans un endroit calme.</li><li>Lis chaque consigne jusqu’au bout.</li><li>Choisis la meilleure réponse, même si tu hésites.</li><li>Prends une pause si tu en as besoin.</li></ol><button type="button" className="button-link" onClick={onBack}>Retour au tableau de bord</button></article></div></section>;
  }

  return <QuizRunner key={mode} title={mode === "diagnostic" ? "Mon diagnostic" : "Mission du jour"} subtitle={mode === "diagnostic" ? "Profil initial · 4 matières" : "Smart Study Plan · +3 points de maîtrise"} questions={questions} immediateFeedback={mode === "smart"} durationMinutes={mode === "diagnostic" ? 60 : state.student.dailyTarget} onAnswer={onAnswer} onFinish={onComplete} onExit={onBack} />;
}

export function ExamsView({ onAnswer, onComplete }: { onAnswer: AnswerRecorder; onComplete: (correct: number, total: number) => void }) {
  const [exam, setExam] = useState<ExamDefinition | null>(null);
  const [category, setCategory] = useState<"Tous" | ExamCategory>("Tous");
  const questions = useMemo(() => exam ? buildExamQuestions(exam) : [], [exam]);
  const visibleExams = category === "Tous" ? EXAM_LIBRARY : EXAM_LIBRARY.filter((item) => item.category === category);
  if (exam) return <QuizRunner key={exam.id} title={exam.name} subtitle={`${exam.duration} minutes · ${exam.count} questions`} questions={questions} immediateFeedback={false} durationMinutes={exam.duration} onAnswer={onAnswer} onFinish={onComplete} onExit={() => setExam(null)} />;

  return <section className="section-view"><div className="notice-banner"><span aria-hidden="true">ⓘ</span><p><strong>Simulations originales.</strong> Elles sont inspirées des compétences publiquement annoncées par les établissements. Cap Secondaire n’est affilié à aucune école.</p></div><div className="section-heading"><div><p className="eyebrow">Choisis ton rythme</p><h2>19 examens blancs</h2><p>Formats rapides, révisions ciblées et longues simulations. La correction et les explications sont dévoilées uniquement à la fin.</p></div><span className="exam-count-pill">{visibleExams.length} disponibles</span></div><div className="exam-toolbar" aria-label="Filtrer les examens"><button type="button" className={`exam-filter ${category === "Tous" ? "active" : ""}`} aria-pressed={category === "Tous"} onClick={() => setCategory("Tous")}>Tous <span>{EXAM_LIBRARY.length}</span></button>{EXAM_CATEGORIES.map((item) => { const count = EXAM_LIBRARY.filter((examItem) => examItem.category === item).length; return <button type="button" key={item} className={`exam-filter ${category === item ? "active" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item} <span>{count}</span></button>; })}</div><div className="exam-grid">{visibleExams.map((item) => <article className={`card exam-option accent-${item.accent}`} key={item.id}><div className="exam-option-top"><span className="exam-symbol" aria-hidden="true">{item.symbol}</span><span className="difficulty-chip">{item.badge} · {item.count} questions</span></div><span className="exam-category-label">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="exam-meta"><span>◷ {item.duration} min</span><span>▣ {item.subjects.join(" · ")}</span></div>{item.note && <p className="exam-note">ⓘ {item.note}</p>}<button type="button" className="secondary-button full-button" onClick={() => setExam(item)}>Commencer</button></article>)}</div><article className="card day-j-card"><div><p className="eyebrow">Préparation mentale</p><h3>Prête pour le Jour J</h3><p>Une courte routine pour gérer ton temps, lire les consignes et garder ton calme.</p></div><div className="day-j-steps"><span>1 · Respirer</span><span>2 · Lire</span><span>3 · Planifier</span><span>4 · Vérifier</span></div></article></section>;
}

function QuizRunner({ title, subtitle, questions, immediateFeedback, durationMinutes, onAnswer, onFinish, onExit }: { title: string; subtitle: string; questions: Question[]; immediateFeedback: boolean; durationMinutes: number; onAnswer: AnswerRecorder; onFinish: (correct: number, total: number) => void; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [help, setHelp] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const current = questions[index];
  const selected = current ? answers[current.id] ?? "" : "";

  useEffect(() => {
    if (completed) return;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [completed, startedAt]);

  const correctCount = questions.reduce((sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0), 0);
  const choose = (value: string) => { if (!revealed) setAnswers((all) => ({ ...all, [current.id]: value })); };
  const validate = () => {
    if (!selected) return;
    const correct = selected === current.answer;
    onAnswer(current, correct, selected, Math.max(15, Math.round(elapsed / Math.max(1, index + 1))));
    setRevealed(true);
  };
  const next = () => {
    if (!immediateFeedback && !selected) return;
    if (index < questions.length - 1) { setIndex((value) => value + 1); setRevealed(false); setHelp(false); return; }
    if (!immediateFeedback) {
      for (const question of questions) onAnswer(question, answers[question.id] === question.answer, answers[question.id] ?? "Sans réponse", Math.max(15, Math.round(elapsed / questions.length)));
    }
    setCompleted(true);
    onFinish(correctCount, questions.length);
  };

  if (!current || completed) {
    const score = questions.length ? Math.round(correctCount / questions.length * 100) : 0;
    return <section className="card results-view section-view"><div className="result-ring" style={{ background: `conic-gradient(var(--teal) 0 ${score}%, #e9edf5 ${score}%)` }}><div><strong>{score}%</strong><span>{correctCount}/{questions.length}</span></div></div><p className="eyebrow">Session terminée</p><h2>{score >= 80 ? "Très belle maîtrise!" : score >= 60 ? "Bonne progression!" : "Une base solide à renforcer"}</h2><p>{score >= 80 ? "Tu peux maintenant passer à des questions plus difficiles." : "Tes erreurs ont été ajoutées au carnet et reviendront sous une nouvelle forme."}</p><div className="result-stats"><span><strong>{formatTime(elapsed)}</strong> temps utilisé</span><span><strong>{questions.length - correctCount}</strong> notions à revoir</span><span><strong>+{correctCount * 10} XP</strong> gagnés</span></div><div className="result-actions"><button type="button" className="primary-button" onClick={onExit}>Continuer →</button><button type="button" className="secondary-button" onClick={() => window.print()}>Imprimer le résultat</button></div></section>;
  }

  const overTime = elapsed > durationMinutes * 60;
  return <section className="focus-shell section-view"><header className="focus-header"><button type="button" className="icon-button" onClick={onExit} aria-label="Quitter la session">×</button><div><strong>{title}</strong><span>{subtitle}</span></div><div className={`timer ${overTime ? "over" : ""}`}>◷ {formatTime(Math.max(0, durationMinutes * 60 - elapsed))}</div></header><div className="focus-progress"><div className="progress-fill" style={{ width: `${(index + 1) / questions.length * 100}%` }} /></div><article className="card question-card"><div className="question-meta"><span>{current.subject}</span><span>Niveau {current.difficulty}</span><span>Question {index + 1} / {questions.length}</span></div><h2>{current.prompt}</h2><div className="answer-grid" role="radiogroup" aria-label="Choix de réponse">{current.options.map((option, optionIndex) => { const isSelected = selected === option; const isCorrect = revealed && option === current.answer; const isWrong = revealed && isSelected && option !== current.answer; return <button type="button" role="radio" aria-checked={isSelected} key={option} className={`answer-option ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => choose(option)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>; })}</div>{revealed && <div className={`feedback-box ${selected === current.answer ? "success" : "review"}`}><h3>{selected === current.answer ? "Bravo, c’est exact!" : "Regardons ensemble"}</h3><p><strong>Ce qu’on cherche :</strong> {current.skill} — {current.subSkill}.</p><p><strong>La stratégie :</strong> {current.explanation}</p><p><strong>Les étapes :</strong> {current.solution}</p></div>}{help && !revealed && <div className="feedback-box hint"><h3>Un petit indice</h3><p>Repère les données importantes, nomme l’opération ou la règle, puis élimine les réponses qui ne peuvent pas fonctionner.</p></div>}<footer className="question-actions"><button type="button" className="button-link" onClick={() => setHelp((value) => !value)} disabled={revealed}>Je ne comprends pas</button>{immediateFeedback && !revealed ? <button type="button" className="primary-button" disabled={!selected} onClick={validate}>Valider ma réponse</button> : <button type="button" className="primary-button" disabled={!selected && !revealed} onClick={next}>{index === questions.length - 1 ? "Terminer" : "Question suivante →"}</button>}</footer></article></section>;
}

function formatTime(seconds: number) { const minutes = Math.floor(seconds / 60); const remaining = seconds % 60; return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`; }
