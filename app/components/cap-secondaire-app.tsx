"use client";

import { useEffect, useMemo, useState } from "react";
import { DEFAULT_STATE, SCHOOLS, type AppState, type Question } from "../../lib/app-data";
import { buildSmartPlan, updateMasteryScore } from "../../lib/mastery";
import { AiCoachView } from "./ai-coach-view";
import { FrenchWorkshopView } from "./french-workshop-view";
import { InstallAppPrompt } from "./install-app-prompt";
import { ExamsView, MissionView } from "./learning-views";
import { ErrorsView, ParentView, SchoolsView } from "./management-views";

export type View = "dashboard" | "mission" | "french" | "coach" | "exams" | "errors" | "schools" | "parent";
export type MissionMode = "smart" | "diagnostic";

const navItems: Array<{ id: View; label: string; icon: string }> = [
  { id: "dashboard", label: "Accueil", icon: "⌂" },
  { id: "mission", label: "Ma mission", icon: "◎" },
  { id: "french", label: "Français +", icon: "Aa" },
  { id: "coach", label: "Coach IA", icon: "✦" },
  { id: "exams", label: "Examens", icon: "▤" },
  { id: "errors", label: "Mes erreurs", icon: "↺" },
  { id: "schools", label: "Mes écoles", icon: "◇" },
  { id: "parent", label: "Espace Parent", icon: "◉" },
];

const pageEyebrows: Record<View, string> = {
  dashboard: "Sprint admission", mission: "Apprentissage adaptatif", french: "Orthographe et conjugaison", coach: "Accompagnement personnalisé", exams: "Mode simulation", errors: "Carnet de progression", schools: "Calendrier 2027-2028", parent: "Vue confidentielle",
};

const mobileNavItems = navItems.filter((item) => ["dashboard", "mission", "french", "coach", "exams"].includes(item.id));

function mergeMastery(stored: AppState["mastery"]) {
  return DEFAULT_STATE.mastery.map((defaultSkill) => stored.find((skill) => skill.id === defaultSkill.id) ?? defaultSkill);
}

function masteryMatchesQuestion(skillId: string, question: Question) {
  const value = `${question.skill} ${question.subSkill}`.toLocaleLowerCase("fr-CA");
  const aliases: Record<string, string[]> = {
    reading: ["compréhension", "lecture"], fractions: ["fraction"], grammar: ["grammaire", "accord"], conjugation: ["conjugaison", "terminaison"], spelling: ["orthographe", "homophone", "dictée", "vocabulaire"], problems: ["problème", "opération", "décimal", "mesure", "géométrie"], logic: ["logique", "suite", "déduction"], english: ["english", "reading", "vocabulary"],
  };
  return (aliases[skillId] ?? []).some((alias) => value.includes(alias));
}

function viewFromHash(): View | null {
  const candidate = window.location.hash.replace("#", "") as View;
  return navItems.some((item) => item.id === candidate) ? candidate : null;
}

export function CapSecondaireApp({ user }: { user: { id: string; displayName: string } }) {
  const localCacheKey = `cap-secondaire-offline-cache-v3:${user.id}`;
  const [view, setView] = useState<View>("dashboard");
  const [missionMode, setMissionMode] = useState<MissionMode>("smart");
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [online, setOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState("Initialisation…");
  const [coachErrorId, setCoachErrorId] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.removeItem("cap-secondaire-offline-cache");
    const cached = window.localStorage.getItem(localCacheKey);
    queueMicrotask(() => {
      if (cached) {
        try { setState(JSON.parse(cached) as AppState); } catch { /* cache ignoré */ }
      }
      setOnline(window.navigator.onLine);
    });
    const load = async () => {
      try {
        const response = await fetch("/api/state", { cache: "no-store" });
        if (response.status === 401) { window.location.assign("/login"); return; }
        const data = (await response.json()) as { state?: AppState; source?: string };
        if (data.state) setState({ ...DEFAULT_STATE, ...data.state, mastery: mergeMastery(data.state.mastery ?? []), schoolDateOverrides: data.state.schoolDateOverrides ?? {} });
        setSyncStatus(data.source === "fallback" ? "Mode local" : "Synchronisée");
      } catch { setSyncStatus("Mode hors connexion"); }
      finally { setHydrated(true); }
    };
    void load();

    const handleOnline = () => { setOnline(true); setSyncStatus("Synchronisation…"); };
    const handleOffline = () => { setOnline(false); setSyncStatus("Mode hors connexion"); };
    const handleHistory = () => {
      const next = viewFromHash();
      if (next) setView(next);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("popstate", handleHistory);
    handleHistory();
    if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js");
    return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); window.removeEventListener("popstate", handleHistory); };
  }, [localCacheKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(localCacheKey, JSON.stringify(state));
    if (!online) return;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/state", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ state }) });
        if (response.status === 401) { window.location.assign("/login"); return; }
        if (!response.ok) throw new Error("save");
        setSyncStatus("Synchronisée");
      } catch { setSyncStatus("Sauvegardée sur cet appareil"); }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [state, hydrated, online, localCacheKey]);

  const selectView = (next: View) => {
    if (next === "mission") setMissionMode("smart");
    if (next === "coach") setCoachErrorId(null);
    setView(next);
    window.history.pushState(null, "", next === "dashboard" ? window.location.pathname : `#${next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const recordAnswer = (question: Question, correct: boolean, given: string, seconds: number) => {
    setState((current) => {
      const mastery = current.mastery.map((skill) => {
        if (skill.subject !== question.subject || !masteryMatchesQuestion(skill.id, question)) return skill;
        const score = updateMasteryScore(skill.score, { correct, difficulty: question.difficulty, responseSeconds: seconds, expectedSeconds: question.estimatedSeconds, recentErrorCount: current.errors.filter((entry) => entry.skill === question.skill).length, daysSinceReview: 3 });
        return { ...skill, score, trend: score - skill.score };
      });
      let errors = current.errors;
      if (!correct) {
        const prior = errors.find((entry) => entry.skill === question.skill);
        errors = prior
          ? errors.map((entry) => entry.id === prior.id ? { ...entry, question: question.prompt, given, answer: question.answer, explanation: question.explanation, date: new Date().toISOString().slice(0, 10), occurrences: entry.occurrences + 1 } : entry)
          : [{ id: `err-${Date.now()}`, question: question.prompt, given, answer: question.answer, skill: question.skill, explanation: question.explanation, date: new Date().toISOString().slice(0, 10), occurrences: 1 }, ...errors];
      }
      return { ...current, mastery, errors, completedQuestions: current.completedQuestions + 1, correctAnswers: current.correctAnswers + (correct ? 1 : 0), student: { ...current.student, xp: current.student.xp + (correct ? 12 : 4) } };
    });
  };

  const recordExam = (correct: number, total: number, diagnostic: boolean) => {
    setState((current) => ({ ...current, diagnosticComplete: current.diagnosticComplete || diagnostic, student: { ...current.student, xp: current.student.xp + 25 + (correct === total ? 75 : 0) } }));
  };

  const updateState = (updater: (current: AppState) => AppState) => setState(updater);
  const launchDiagnostic = () => { setMissionMode("diagnostic"); setView("mission"); window.history.pushState(null, "", "#mission"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openCoachForError = (errorId: string) => { setCoachErrorId(errorId); setView("coach"); window.history.pushState(null, "", "#coach"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Aller au contenu</a>
      <aside className="sidebar" aria-label="Navigation principale">
        <div className="brand"><div className="brand-mark" aria-hidden="true">C</div><div className="brand-copy"><p className="brand-name">Cap Secondaire</p><p className="brand-tagline">Prépare-toi. Progresse. Réussis.</p></div></div>
        <nav className="nav-list">{navItems.map((item) => <button key={item.id} type="button" className={`nav-button ${view === item.id ? "active" : ""}`} onClick={() => selectView(item.id)} aria-current={view === item.id ? "page" : undefined}><span className="nav-icon" aria-hidden="true">{item.icon}</span><span className="nav-label">{item.label}</span></button>)}</nav>
        <div className="nav-spacer" />
        <div className="sidebar-progress"><p>Niveau {Math.max(1, Math.floor(state.student.xp / 200))} · Exploratrice</p><strong>{state.student.xp.toLocaleString("fr-CA")} XP</strong><div className="progress-track" style={{ marginTop: ".65rem" }}><div className="progress-fill" style={{ width: `${state.student.xp % 200 / 2}%` }} /></div></div>
      </aside>

      <main className="main-area" id="main-content">
        <header className="topbar">
          <div><p className="eyebrow">{pageEyebrows[view]}</p><h1 className="page-title">{view === "dashboard" ? `Bonjour ${state.student.name}` : navItems.find((item) => item.id === view)?.label} <span aria-hidden="true">{view === "dashboard" ? "👋" : ""}</span></h1></div>
          <div className="top-actions"><div className="status-pill"><span className={`status-dot ${online ? "" : "offline"}`} />{syncStatus}</div><button type="button" className="profile-pill profile-button" onClick={() => setView("parent")} aria-label="Ouvrir l’espace Parent"><div className="avatar">{state.student.name.slice(0, 1).toUpperCase()}</div><span>{user.displayName.split(/\s+/)[0]}</span></button><form action="/api/auth/logout" method="post"><button type="submit" className="signout-button" aria-label="Se déconnecter">Déconnexion</button></form></div>
        </header>
        <InstallAppPrompt visible={view === "dashboard"} />
        <div className="content">
          {view === "dashboard" && <Dashboard state={state} onNavigate={selectView} onDiagnostic={launchDiagnostic} />}
          {view === "mission" && <MissionView mode={missionMode} state={state} onAnswer={recordAnswer} onComplete={(correct, total) => recordExam(correct, total, missionMode === "diagnostic")} onBack={() => selectView("dashboard")} />}
          {view === "french" && <FrenchWorkshopView state={state} onAnswer={recordAnswer} />}
          {view === "coach" && <AiCoachView state={state} initialErrorId={coachErrorId} />}
          {view === "exams" && <ExamsView onAnswer={recordAnswer} onComplete={(correct, total) => recordExam(correct, total, false)} />}
          {view === "errors" && <ErrorsView state={state} onReview={() => selectView("mission")} onCoach={openCoachForError} />}
          {view === "schools" && <SchoolsView state={state} onUpdate={updateState} />}
          {view === "parent" && <ParentView state={state} onUpdate={updateState} onDiagnostic={launchDiagnostic} />}
        </div>
      </main>
      <nav className="mobile-nav" aria-label="Navigation mobile">{mobileNavItems.map((item) => <button key={item.id} type="button" className={`nav-button ${view === item.id ? "active" : ""}`} onClick={() => selectView(item.id)}><span className="nav-icon" aria-hidden="true">{item.icon}</span><span className="nav-label">{item.label}</span></button>)}</nav>
    </div>
  );
}

function Dashboard({ state, onNavigate, onDiagnostic }: { state: AppState; onNavigate: (view: View) => void; onDiagnostic: () => void }) {
  const plan = buildSmartPlan(state.mastery, state.student.dailyTarget);
  const target = useMemo(() => {
    const future = SCHOOLS.filter((school) => state.selectedSchoolIds.includes(school.id)).map((school) => ({ ...school, effectiveDate: state.schoolDateOverrides[school.id] || school.examDate })).filter((school) => school.effectiveDate && new Date(`${school.effectiveDate}T12:00:00`) >= new Date()).sort((a, b) => String(a.effectiveDate).localeCompare(String(b.effectiveDate)));
    return future[0] ?? SCHOOLS.find((school) => school.id === "laval")!;
  }, [state.selectedSchoolIds, state.schoolDateOverrides]);
  const days = target.effectiveDate ? daysUntil(target.effectiveDate) : null;
  const successRate = state.completedQuestions ? Math.round(state.correctAnswers / state.completedQuestions * 100) : 0;
  const overall = Math.round(state.mastery.reduce((sum, skill) => sum + skill.score, 0) / state.mastery.length);

  return <section className="section-view" aria-label="Tableau de bord"><div className="dashboard-grid"><div className="stack">
    <article className="card mission-card"><div className="mission-top"><div><p className="eyebrow" style={{ color: "#6be0d3" }}>Mission du jour · Plan intelligent</p><h2>Prête à gagner 3 points de maîtrise?</h2><p className="subcopy">Une session courte, construite à partir de tes lacunes, de tes erreurs récentes et de la proximité des examens.</p></div><div className="time-badge"><strong>{state.student.dailyTarget}</strong><span>minutes</span></div></div><div className="mission-list">{plan.slice(0, 3).map((item) => <div className="mission-item" key={item.id}><span>{item.minutes} min · {item.subject}</span><strong>{item.label}</strong></div>)}</div><div className="mission-actions"><button type="button" className="primary-button" onClick={() => onNavigate("mission")}>Commencer ma mission →</button><button type="button" className="ghost-button" onClick={onDiagnostic}>{state.diagnosticComplete ? "Refaire mon diagnostic" : "Faire mon diagnostic"}</button></div></article>
    <article className="card french-dashboard-card"><div className="french-dashboard-symbol" aria-hidden="true">Aa</div><div><p className="eyebrow">Nouveau · Priorité français</p><h2>60 activités d’orthographe et de conjugaison</h2><p>Conjugaison express, homophones, correction de phrases et mini-dictées audio.</p></div><button type="button" className="secondary-button" onClick={() => onNavigate("french")}>Ouvrir l’atelier →</button></article>
    <div className="stats-grid" aria-label="Indicateurs de progression"><Stat icon="↗" label="Maîtrise globale" value={`${overall} %`} delta="Score adaptatif" /><Stat icon="🔥" label="Série actuelle" value={`${state.student.streak} jours`} delta="Objectif : 7 jours" /><Stat icon="◷" label="Cette semaine" value={`${Math.floor(state.student.weeklyMinutes / 60)} h ${state.student.weeklyMinutes % 60}`} delta="Objectif : 4 h" /><Stat icon="✓" label="Questions" value={String(state.completedQuestions)} delta={`${successRate} % de réussite`} /></div>
    <article className="card panel"><div className="panel-header"><div><h2 className="panel-title">Ma carte de maîtrise</h2><p className="panel-subtitle">Les bonnes priorités, au bon moment</p></div><button type="button" className="button-link" onClick={() => onNavigate("parent")}>Voir le détail</button></div><div className="skill-list">{state.mastery.slice(0, 5).map((skill, index) => <div className="skill-row" key={skill.id}><strong>{skill.label}</strong><span>{skill.score} %</span><div className="progress-track"><div className={`progress-fill ${index % 3 === 1 ? "indigo" : index % 3 === 2 ? "coral" : ""}`} style={{ width: `${skill.score}%` }} /></div></div>)}</div></article>
  </div><div className="stack side-column">
    <article className="card ai-teaser-card"><div className="ai-teaser-icon" aria-hidden="true">✦</div><div><p className="eyebrow">Nouveau · Coach Cap</p><h2 className="panel-title">Une explication juste pour toi</h2><p>Pose une question, transforme une erreur en stratégie ou crée un exercice personnalisé.</p></div><button type="button" className="secondary-button full-button" onClick={() => onNavigate("coach")}>Ouvrir le Coach IA</button></article>
    <article className="card exam-card"><div className="panel-header"><div><h2 className="panel-title">Prochain objectif</h2><p className="panel-subtitle">Calendrier d’admission</p></div><span aria-hidden="true">🎯</span></div><div className="countdown"><div className="countdown-ring"><div><span>{days === null ? <strong>—</strong> : <><strong>{days}</strong>jours</>}</span></div></div><div><h3>{target.name}</h3><p>{target.process}{target.subjects.length ? ` · ${target.subjects.join(" et ")}` : ""}.</p><a className="school-source" href={target.source} target="_blank" rel="noreferrer">{target.verified ? "✓ Source officielle vérifiée" : "◷ Information à confirmer"}</a></div></div><button type="button" className="secondary-button full-button" onClick={() => onNavigate("schools")}>Voir toutes mes écoles</button></article>
    <article className="card tip-card"><div className="tip-icon" aria-hidden="true">💡</div><blockquote>« Lis d’abord la question, puis retourne chercher les indices dans le texte. Tu sauras exactement quoi repérer. »</blockquote></article>
    <article className="card panel"><div className="panel-header"><div><h2 className="panel-title">Prochain mini examen</h2><p className="panel-subtitle">Samedi · 30 minutes</p></div><span aria-hidden="true">▤</span></div><p className="muted-copy">12 questions mixtes pour mesurer tes progrès de la semaine.</p><button type="button" className="button-link next-link" onClick={() => onNavigate("exams")}>Voir les examens →</button></article>
  </div></div></section>;
}

function Stat({ icon, label, value, delta }: { icon: string; label: string; value: string; delta: string }) { return <article className="card stat-card"><div className="stat-icon" aria-hidden="true">{icon}</div><p className="stat-label">{label}</p><h2 className="stat-value">{value}</h2><p className="stat-delta">{delta}</p></article>; }
export function daysUntil(date: string) { const target = new Date(`${date}T12:00:00`); return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86_400_000)); }
