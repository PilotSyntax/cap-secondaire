"use client";

import { useState } from "react";
import type { AppState, Question } from "../../lib/app-data";
import { activitiesFor, activityToQuestion, FRENCH_ACTIVITIES, FRENCH_CATEGORY_INFO, normalizeFrenchAnswer, type FrenchActivity, type FrenchActivityCategory } from "../../lib/french-workshop";

type AnswerRecorder = (question: Question, correct: boolean, given: string, seconds: number) => void;

export function FrenchWorkshopView({ state, onAnswer }: { state: AppState; onAnswer: AnswerRecorder }) {
  const [category, setCategory] = useState<FrenchActivityCategory | null>(null);
  const [session, setSession] = useState<FrenchActivity[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [validated, setValidated] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [audioUnavailable, setAudioUnavailable] = useState(false);

  const start = (nextCategory: FrenchActivityCategory) => {
    setCategory(nextCategory);
    setSession(activitiesFor(nextCategory, 8, state.completedQuestions));
    setIndex(0);
    setInput("");
    setValidated(false);
    setCorrect(false);
    setScore(0);
    setHint(false);
    setFinished(false);
    setStartedAt(Date.now());
    setAudioUnavailable(false);
  };

  const current = session[index];

  const validate = () => {
    if (!current || !input.trim() || validated) return;
    const isCorrect = normalizeFrenchAnswer(input) === normalizeFrenchAnswer(current.answer);
    setCorrect(isCorrect);
    setValidated(true);
    if (isCorrect) setScore((value) => value + 1);
    onAnswer(activityToQuestion(current), isCorrect, input.trim(), Math.max(15, Math.round((Date.now() - startedAt) / 1000)));
  };

  const next = () => {
    if (index === session.length - 1) { setFinished(true); return; }
    setIndex((value) => value + 1);
    setInput("");
    setValidated(false);
    setCorrect(false);
    setHint(false);
    setStartedAt(Date.now());
  };

  const speak = () => {
    if (!current || !("speechSynthesis" in window)) { setAudioUnavailable(true); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.prompt);
    utterance.lang = "fr-CA";
    utterance.rate = 0.78;
    window.speechSynthesis.speak(utterance);
  };

  if (!category) return <WorkshopHome state={state} onStart={start} />;

  if (finished) {
    const percentage = Math.round(score / Math.max(1, session.length) * 100);
    return <section className="section-view french-workshop"><article className="card french-results"><div className="french-score-ring" style={{ background: `conic-gradient(var(--coral) 0 ${percentage}%, #e9edf5 ${percentage}%)` }}><div><strong>{percentage}%</strong><span>{score}/{session.length}</span></div></div><p className="eyebrow">Atelier terminé</p><h2>{percentage >= 80 ? "Très belle maîtrise!" : percentage >= 60 ? "Bonne progression!" : "On consolide la règle"}</h2><p>{percentage >= 80 ? "Tu peux passer à une autre activité ou refaire ce défi plus tard." : "Les réponses à retravailler sont dans ton carnet d’erreurs. Une deuxième courte pratique aidera à les mémoriser."}</p><div className="french-result-actions"><button type="button" className="primary-button" onClick={() => start(category)}>Refaire une série</button><button type="button" className="secondary-button" onClick={() => setCategory(null)}>Choisir une autre activité</button></div></article></section>;
  }

  if (!current) return <WorkshopHome state={state} onStart={start} />;
  const isDictation = current.category === "Dictée";

  return <section className="section-view french-workshop">
    <header className="focus-header french-focus-header"><button type="button" className="icon-button" onClick={() => setCategory(null)} aria-label="Quitter l’atelier">×</button><div><strong>{FRENCH_CATEGORY_INFO.find((item) => item.id === category)?.title}</strong><span>{current.focus} · Niveau {current.difficulty}</span></div><div className="timer">{index + 1} / {session.length}</div></header>
    <div className="focus-progress"><div className="progress-fill coral" style={{ width: `${(index + 1) / session.length * 100}%` }} /></div>
    <article className="card french-activity-card">
      <div className="french-activity-meta"><span>{current.category}</span><span>{current.skill}</span><span>6e année</span></div>
      <p className="french-instruction">{current.instruction}</p>
      {isDictation ? <div className="dictation-player"><button type="button" onClick={speak} aria-label="Écouter la phrase"><span aria-hidden="true">▶</span></button><div><strong>Écoute la phrase</strong><p>Tu peux la réécouter autant de fois que nécessaire.</p></div></div> : <h2>{current.prompt}</h2>}
      {audioUnavailable && <p className="audio-fallback">L’audio n’est pas disponible sur ce navigateur. Demande à un adulte de lire la phrase après avoir ouvert l’indice.</p>}
      <label className="french-answer-label" htmlFor="french-answer">Ta réponse</label>
      {current.category === "Correction" || isDictation ? <textarea id="french-answer" rows={3} value={input} disabled={validated} onChange={(event) => setInput(event.target.value)} placeholder={isDictation ? "Écris ici ce que tu entends…" : "Réécris la phrase corrigée…"} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") validate(); }} /> : <input id="french-answer" value={input} disabled={validated} onChange={(event) => setInput(event.target.value)} placeholder="Écris ta réponse…" onKeyDown={(event) => { if (event.key === "Enter") validate(); }} />}
      {hint && !validated && <div className="french-hint"><strong>Indice</strong><p>{isDictation ? `${current.hint} La phrase contient ${current.prompt.split(/\s+/u).length} mots.` : current.hint}</p></div>}
      {validated && <div className={`french-feedback ${correct ? "success" : "review"}`}><div className="french-feedback-title"><span>{correct ? "✓" : "↺"}</span><h3>{correct ? "Bravo, c’est exact!" : "Voici la correction"}</h3></div>{!correct && <p><strong>Réponse attendue :</strong> {current.answer}</p>}<p><strong>Règle :</strong> {current.explanation}</p></div>}
      <footer className="question-actions"><button type="button" className="button-link" disabled={validated} onClick={() => setHint((value) => !value)}>{hint ? "Masquer l’indice" : "Voir un indice"}</button>{validated ? <button type="button" className="primary-button" onClick={next}>{index === session.length - 1 ? "Voir mon résultat" : "Activité suivante →"}</button> : <button type="button" className="primary-button" disabled={!input.trim()} onClick={validate}>Vérifier ma réponse</button>}</footer>
    </article>
  </section>;
}

function WorkshopHome({ state, onStart }: { state: AppState; onStart: (category: FrenchActivityCategory) => void }) {
  const frenchMastery = state.mastery.filter((item) => item.subject === "Français");
  const lowest = [...frenchMastery].sort((a, b) => a.score - b.score)[0];
  return <section className="section-view french-workshop">
    <div className="french-hero card"><div><p className="eyebrow">Priorité français</p><h2>Atelier orthographe & conjugaison</h2><p>Des séries courtes et variées pour automatiser les règles, repérer les erreurs et écrire avec confiance.</p><div className="french-hero-stats"><span><strong>{FRENCH_ACTIVITIES.length}</strong> activités</span><span><strong>4</strong> formats</span><span><strong>8–12</strong> min par série</span></div></div><div className="french-wordmark" aria-hidden="true"><span>être</span><strong>je suis</strong><small>nous serons</small></div></div>
    <div className="french-recommendation"><span aria-hidden="true">✦</span><p><strong>Parcours recommandé :</strong> commence par {lowest?.label.toLocaleLowerCase("fr-CA") || "la conjugaison"}, puis termine par une mini-dictée pour réutiliser la règle en contexte.</p></div>
    <div className="french-category-grid">{FRENCH_CATEGORY_INFO.map((item) => { const count = FRENCH_ACTIVITIES.filter((activity) => activity.category === item.id).length; return <article className="card french-category-card" key={item.id}><div className="french-category-top"><span className="french-category-symbol" aria-hidden="true">{item.symbol}</span><span className="french-count">{count} activités</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="french-duration">◷ {item.duration}</div><button type="button" className="secondary-button full-button" onClick={() => onStart(item.id)}>Commencer →</button></article>; })}</div>
    <article className="card french-parent-tip"><span aria-hidden="true">💡</span><div><strong>Conseil aux parents</strong><p>Deux séries de 10 minutes par jour sont plus efficaces qu’une longue séance. Demandez à l’enfant d’expliquer la règle après chaque correction.</p></div></article>
  </section>;
}
