import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityEvents, familyStates } from "../../../db/schema";
import { CURRENT_DATA_VERSION, DEFAULT_STATE, type AppState } from "../../../lib/app-data";
import { getRequestUser, type AuthUser } from "../../../lib/auth-server";

export const dynamic = "force-dynamic";

function isValidState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AppState>;
  return Boolean(candidate.student?.name && Array.isArray(candidate.mastery) && Array.isArray(candidate.errors));
}

function newUserState(user: AuthUser): AppState {
  const firstName = user.displayName.trim().split(/\s+/)[0] || "Élève";
  return {
    ...DEFAULT_STATE,
    student: { ...DEFAULT_STATE.student, name: firstName, xp: 0, streak: 0, weeklyMinutes: 0 },
    selectedSchoolIds: [],
    schoolStatuses: {},
    schoolDateOverrides: {},
    customSchools: [],
    mastery: DEFAULT_STATE.mastery.map((skill) => ({ ...skill, score: 0, trend: 0 })),
    errors: [],
    completedQuestions: 0,
    correctAnswers: 0,
    diagnosticComplete: false,
  };
}

async function resetFamilyState(user: AuthUser) {
  const db = getDb();
  const resetState = { ...newUserState(user), lastUpdated: new Date().toISOString() };
  await db.delete(activityEvents).where(eq(activityEvents.familyId, user.id));
  await db.insert(familyStates).values({ id: user.id, payload: JSON.stringify(resetState), updatedAt: resetState.lastUpdated }).onConflictDoUpdate({ target: familyStates.id, set: { payload: JSON.stringify(resetState), updatedAt: resetState.lastUpdated } });
  return resetState;
}

export async function GET(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user) return Response.json({ error: "Authentification requise" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const db = getDb();
    const [row] = await db.select().from(familyStates).where(eq(familyStates.id, user.id)).limit(1);
    if (row) {
      const stored = JSON.parse(row.payload) as Partial<AppState>;
      if (stored.dataVersion === CURRENT_DATA_VERSION) return Response.json({ state: stored, source: "cloud" });
      const reset = await resetFamilyState(user);
      return Response.json({ state: reset, source: "reset" });
    }

    const seeded = await resetFamilyState(user);
    return Response.json({ state: seeded, source: "seed" });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Stockage temporairement indisponible" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user) return Response.json({ error: "Authentification requise" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const payload = (await request.json()) as { state?: unknown };
    if (!isValidState(payload.state)) return Response.json({ error: "État invalide" }, { status: 400 });

    const state: AppState = { ...payload.state, dataVersion: CURRENT_DATA_VERSION, lastUpdated: new Date().toISOString() };
    const db = getDb();
    await db.insert(familyStates).values({ id: user.id, payload: JSON.stringify(state), updatedAt: state.lastUpdated }).onConflictDoUpdate({ target: familyStates.id, set: { payload: JSON.stringify(state), updatedAt: state.lastUpdated } });
    return Response.json({ state, saved: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sauvegarde impossible" }, { status: 500 });
  }
}
