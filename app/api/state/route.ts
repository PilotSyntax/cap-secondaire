import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityEvents, familyStates } from "../../../db/schema";
import { CURRENT_DATA_VERSION, DEFAULT_STATE, type AppState } from "../../../lib/app-data";

export const dynamic = "force-dynamic";
const FAMILY_ID = "cap-secondaire-family";

function isValidState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AppState>;
  return Boolean(candidate.student?.name && Array.isArray(candidate.mastery) && Array.isArray(candidate.errors));
}

async function resetFamilyState() {
  const db = getDb();
  const resetState = { ...DEFAULT_STATE, lastUpdated: new Date().toISOString() };
  await db.delete(activityEvents).where(eq(activityEvents.familyId, FAMILY_ID));
  await db.insert(familyStates).values({ id: FAMILY_ID, payload: JSON.stringify(resetState), updatedAt: resetState.lastUpdated }).onConflictDoUpdate({ target: familyStates.id, set: { payload: JSON.stringify(resetState), updatedAt: resetState.lastUpdated } });
  return resetState;
}

export async function GET() {
  try {
    const db = getDb();
    const [row] = await db.select().from(familyStates).where(eq(familyStates.id, FAMILY_ID)).limit(1);
    if (row) {
      const stored = JSON.parse(row.payload) as Partial<AppState>;
      if (stored.dataVersion === CURRENT_DATA_VERSION) return Response.json({ state: stored, source: "cloud" });
      const reset = await resetFamilyState();
      return Response.json({ state: reset, source: "reset" });
    }

    const seeded = await resetFamilyState();
    return Response.json({ state: seeded, source: "seed" });
  } catch (error) {
    return Response.json({ state: DEFAULT_STATE, source: "fallback", warning: error instanceof Error ? error.message : "Stockage temporairement indisponible" });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { state?: unknown };
    if (!isValidState(payload.state)) return Response.json({ error: "État invalide" }, { status: 400 });

    const state: AppState = { ...payload.state, dataVersion: CURRENT_DATA_VERSION, lastUpdated: new Date().toISOString() };
    const db = getDb();
    await db.insert(familyStates).values({ id: FAMILY_ID, payload: JSON.stringify(state), updatedAt: state.lastUpdated }).onConflictDoUpdate({ target: familyStates.id, set: { payload: JSON.stringify(state), updatedAt: state.lastUpdated } });
    return Response.json({ state, saved: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sauvegarde impossible" }, { status: 500 });
  }
}
