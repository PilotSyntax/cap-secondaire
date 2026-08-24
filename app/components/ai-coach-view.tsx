"use client";

import { useMemo, useState } from "react";
import type { AppState, ErrorEntry, Subject } from "../../lib/app-data";
import type { AiCoachResult, AiRequest } from "../../lib/ai-types";

type CoachTab = "ask" | "exercise" | "errors";
const SUBJECTS: Subject[] = ["Mathématiques", "Français", "Logique", "Anglais"];

async function requestCoach(payload: AiRequest) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Le Coach est temporairement indisponible.");
  return response.json() as Promise<AiCoachResult>;
}

export function AiCoachView({ state, initialErrorId }: { state: AppState; initialErrorId?: string | null }) {
  const [tab, setTab] = useState<CoachTab>(initialErrorId ? "errors" : "ask");
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState<Subject>("Mathématiques");
  const [skill, setSkill] = useState("Fractions");
  const [selectedErrorId, setSelectedErrorId] = useState(initialErrorId || state.errors[0]?.id || "");
  const [result, setResult] = useState<AiCoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [revealed, setRevealed] = useState(false);

  const skills = useMemo(() => state.mastery.filter((item) => item.subject === subject), [state.mastery, subject]);

  const run = async (payload: AiRequest) => {
    setLoading(true);
    setErrorMessage("");
    setResult(null);
    setRevealed(false);
    try { setResult(await requestCoach(payload)); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Réessaie dans un instant."); }
    finally { setLoading(false); }
  };

  const ask = (question = prompt) => {
    if (!question.trim()) return;
    setPrompt(question);
    void run({ action: "ask", prompt: question, subject: inferSubject(question) });
  };

  const coachError = () => {
    const entry = state.errors.find((item) => item.id === selectedErrorId);
    if (!entry) return;
    void run({ action: "coach", skill: entry.skill, error: pickError(entry) });
  };

  const chooseTab = (next: CoachTab) => {
    setTab(next);
    setResult(null);
    setErrorMessage("");
    setRevealed(false);
  };

  return <section className="section-view ai-shell" aria-labelledby="ai-title">
    <div className="ai-hero card">
      <div className="ai-spark" aria-hidden="true">✦</div>
      <div><p className="eyebrow">Hybride sécurisé · à la demande</p><h2 id="ai-title">Coach Cap</h2><p>Une aide claire pour comprendre tes erreurs, pratiquer juste ce qu’il faut et poser tes questions.</p></div>
      <div className="ai-privacy"><span aria-hidden="true">🔒</span><span>Gemini seulement à la demande<br /><strong>Aucun profil complet transmis</strong></span></div>
    </div>

    <div className="ai-capability-grid" aria-label="Capacités du Coach">
      <button type="button" className={`card ai-capability ${tab === "ask" ? "active" : ""}`} onClick={() => chooseTab("ask")}><span>?</span><strong>Poser une question</strong><small>Une explication simple et guidée</small></button>
      <button type="button" className={`card ai-capability ${tab === "exercise" ? "active" : ""}`} onClick={() => chooseTab("exercise")}><span>＋</span><strong>Créer un exercice</strong><small>Selon la matière et la compétence</small></button>
      <button type="button" className={`card ai-capability ${tab === "errors" ? "active" : ""}`} onClick={() => chooseTab("errors")}><span>↺</span><strong>Comprendre une erreur</strong><small>Une nouvelle façon de l’expliquer</small></button>
    </div>

    <div className="ai-workspace">
      <article className="card ai-panel">
        {tab === "ask" && <form onSubmit={(event) => { event.preventDefault(); ask(); }}>
          <div className="ai-panel-heading"><div><p className="eyebrow">Assistant questions-réponses</p><h3>Qu’aimerais-tu comprendre?</h3></div><span className="ai-limit">{prompt.length}/600</span></div>
          <label className="sr-only" htmlFor="coach-question">Question pour le Coach</label>
          <textarea id="coach-question" className="ai-textarea" maxLength={600} rows={5} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ex. Pourquoi doit-on multiplier le numérateur et le dénominateur par le même nombre?" />
          <div className="ai-quick-prompts"><span>Suggestions</span>{["Explique-moi les fractions", "Comment gérer mon temps à l’examen?", "Aide-moi avec les accords"].map((suggestion) => <button type="button" key={suggestion} onClick={() => ask(suggestion)}>{suggestion}</button>)}</div>
          <button className="primary-button ai-submit" type="submit" disabled={loading || !prompt.trim()}>{loading ? "Le Coach réfléchit…" : "Demander au Coach ✦"}</button>
        </form>}

        {tab === "exercise" && <div>
          <div className="ai-panel-heading"><div><p className="eyebrow">Génération personnalisée</p><h3>Choisis ton entraînement</h3></div></div>
          <div className="ai-form-grid"><label>Matière<select value={subject} onChange={(event) => { const next = event.target.value as Subject; setSubject(next); setSkill(state.mastery.find((item) => item.subject === next)?.label || "Révision générale"); }}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select></label><label>Compétence<select value={skill} onChange={(event) => setSkill(event.target.value)}>{skills.map((item) => <option key={item.id} value={item.label}>{item.label} · {item.score}%</option>)}</select></label></div>
          <p className="ai-form-note">Le Coach part de la compétence choisie. Le mode local puise dans la banque validée; le mode IA crée une nouvelle variante.</p>
          <button className="primary-button ai-submit" type="button" disabled={loading} onClick={() => void run({ action: "exercise", subject, skill })}>{loading ? "Création en cours…" : "Créer mon exercice ✦"}</button>
        </div>}

        {tab === "errors" && <div>
          <div className="ai-panel-heading"><div><p className="eyebrow">Coach de l’erreur</p><h3>Transformons l’erreur en stratégie</h3></div></div>
          {state.errors.length ? <><label className="ai-error-select">Erreur à revoir<select value={selectedErrorId} onChange={(event) => setSelectedErrorId(event.target.value)}>{state.errors.map((entry) => <option key={entry.id} value={entry.id}>{entry.skill} · {entry.question.slice(0, 70)}</option>)}</select></label><ErrorPreview entry={state.errors.find((entry) => entry.id === selectedErrorId) ?? state.errors[0]} /><button className="primary-button ai-submit" type="button" disabled={loading} onClick={coachError}>{loading ? "Le Coach prépare l’explication…" : "M’expliquer autrement ✦"}</button></> : <div className="ai-empty"><span>✓</span><h3>Aucune erreur à revoir</h3><p>Les erreurs de tes prochaines missions apparaîtront ici. Tu peux déjà poser une question ou créer un exercice.</p></div>}
        </div>}
      </article>

      <aside className="card ai-result" aria-live="polite">
        {loading ? <div className="ai-thinking"><span>✦</span><h3>Je prépare une réponse claire…</h3><p>Je vérifie la notion et je construis un petit entraînement.</p></div> : errorMessage ? <div className="ai-thinking"><span>!</span><h3>Petit contretemps</h3><p>{errorMessage}</p></div> : result ? <CoachResult result={result} revealed={revealed} onReveal={() => setRevealed(true)} /> : <div className="ai-thinking"><span>✦</span><h3>Le Coach est prêt</h3><p>Choisis une action à gauche. Une réponse n’est produite que lorsque tu la demandes.</p><ul><li>Explications adaptées à la 6e année</li><li>Exercices avec solution guidée</li><li>Mode local toujours disponible</li></ul></div>}
      </aside>
    </div>
    <div className="ai-data-note" role="note"><strong>Protection des renseignements personnels</strong><span>Ne saisis jamais de nom complet, d’adresse ou de coordonnées. En mode Gemini gratuit, seule la demande en cours est transmise; Google indique que ces données peuvent servir à améliorer ses produits. Le mode local reste toujours disponible.</span></div>
  </section>;
}

function CoachResult({ result, revealed, onReveal }: { result: AiCoachResult; revealed: boolean; onReveal: () => void }) {
  return <div className="coach-result-content">
    <div className="ai-result-top"><span className={`ai-mode-badge ${result.source}`}>{result.source === "gemini" ? "✦ Gemini sécurisé" : "✓ Mode local"}</span><span className="ai-safe">Réponse à la demande</span></div>
    <h3>{result.title}</h3><p>{result.message}</p>
    {result.steps.length > 0 && <ol className="ai-steps">{result.steps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}</ol>}
    {result.practice && <div className="ai-practice"><p className="eyebrow">À toi d’essayer</p><h4>{result.practice.question}</h4><div className="ai-option-list">{result.practice.options.map((option, index) => <div key={`${index}-${option}`}><span>{String.fromCharCode(65 + index)}</span>{option}</div>)}</div>{revealed ? <div className="ai-answer"><strong>Réponse : {result.practice.answer}</strong><p>{result.practice.explanation}</p></div> : <button type="button" className="secondary-button" onClick={onReveal}>Voir la solution</button>}</div>}
  </div>;
}

function ErrorPreview({ entry }: { entry: ErrorEntry }) {
  return <div className="ai-error-preview"><strong>{entry.question}</strong><div><span>Ta réponse : <b>{entry.given}</b></span><span>Réponse attendue : <b>{entry.answer}</b></span></div></div>;
}

function pickError(entry: ErrorEntry): AiRequest["error"] {
  return { question: entry.question, given: entry.given, answer: entry.answer, skill: entry.skill, explanation: entry.explanation };
}

function inferSubject(question: string): Subject | undefined {
  const normalized = question.toLocaleLowerCase("fr-CA");
  if (/fraction|calcul|math|géométr|décimal/.test(normalized)) return "Mathématiques";
  if (/accord|grammaire|français|lecture|orthographe/.test(normalized)) return "Français";
  if (/logique|suite|déduction/.test(normalized)) return "Logique";
  if (/anglais|english/.test(normalized)) return "Anglais";
  return undefined;
}
