import { and, eq, gt } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../db";
import { authSessions, familyStates, users } from "../db/schema";
import type { GoogleIdentity } from "./google-auth";

export const SESSION_COOKIE = "__Host-cap_secondaire_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;
const LEGACY_FAMILY_ID = "cap-secondaire-family";

type RuntimeAuthEnv = {
  ALLOWED_USER_EMAILS?: string;
  BOOTSTRAP_USER_EMAIL?: string;
  GOOGLE_CLIENT_ID?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export function authEnvironment(): RuntimeAuthEnv {
  return env as unknown as RuntimeAuthEnv;
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function tokenHash(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return base64Url(new Uint8Array(digest));
}

function cookieValue(cookieHeader: string | null, name: string): string | null {
  const prefix = `${name}=`;
  return cookieHeader?.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length) ?? null;
}

export function isAllowedEmail(email: string): boolean {
  const configured = authEnvironment().ALLOWED_USER_EMAILS;
  if (!configured?.trim()) return true;
  const allowed = configured.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export async function getUserFromCookie(cookieHeader: string | null): Promise<AuthUser | null> {
  const token = cookieValue(cookieHeader, SESSION_COOKIE);
  if (!token || token.length > 256) return null;
  const sessionId = await tokenHash(token);
  const db = getDb();
  const [row] = await db.select({
    id: users.id,
    email: users.email,
    displayName: users.displayName,
  }).from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .where(and(eq(authSessions.id, sessionId), gt(authSessions.expiresAt, new Date().toISOString()), eq(users.status, "active")))
    .limit(1);
  return row ?? null;
}

export async function getRequestUser(request: Request): Promise<AuthUser | null> {
  return getUserFromCookie(request.headers.get("cookie"));
}

export async function upsertGoogleUser(identity: GoogleIdentity): Promise<AuthUser> {
  const db = getDb();
  const now = new Date().toISOString();
  const [existing] = await db.select().from(users).where(
    and(eq(users.provider, "google"), eq(users.providerSubject, identity.subject)),
  ).limit(1);
  if (existing) {
    await db.update(users).set({ email: identity.email, displayName: identity.displayName, lastLoginAt: now }).where(eq(users.id, existing.id));
    return { id: existing.id, email: identity.email, displayName: identity.displayName };
  }
  const [sameEmail] = await db.select().from(users).where(eq(users.email, identity.email)).limit(1);
  const id = sameEmail?.id ?? crypto.randomUUID();
  if (sameEmail) {
    await db.update(users).set({ provider: "google", providerSubject: identity.subject, displayName: identity.displayName, status: "active", lastLoginAt: now }).where(eq(users.id, id));
  } else {
    await db.insert(users).values({ id, email: identity.email, displayName: identity.displayName, provider: "google", providerSubject: identity.subject, status: "active", createdAt: now, lastLoginAt: now });
  }
  return { id, email: identity.email, displayName: identity.displayName };
}

export async function createSession(userId: string): Promise<{ cookie: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = base64Url(bytes);
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DURATION_SECONDS * 1000);
  const db = getDb();
  await db.insert(authSessions).values({ id: await tokenHash(token), userId, createdAt: now.toISOString(), expiresAt: expires.toISOString() });
  return { cookie: `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DURATION_SECONDS}` };
}

export async function deleteSession(cookieHeader: string | null): Promise<void> {
  const token = cookieValue(cookieHeader, SESSION_COOKIE);
  if (!token) return;
  await getDb().delete(authSessions).where(eq(authSessions.id, await tokenHash(token)));
}

export function expiredSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function migrateLegacyStateForBootstrapUser(user: AuthUser): Promise<void> {
  const bootstrapEmail = authEnvironment().BOOTSTRAP_USER_EMAIL?.trim().toLowerCase();
  if (!bootstrapEmail || user.email.toLowerCase() !== bootstrapEmail) return;
  const db = getDb();
  const [personal] = await db.select().from(familyStates).where(eq(familyStates.id, user.id)).limit(1);
  if (personal) return;
  const [legacy] = await db.select().from(familyStates).where(eq(familyStates.id, LEGACY_FAMILY_ID)).limit(1);
  if (!legacy) return;
  await db.insert(familyStates).values({ id: user.id, payload: legacy.payload, updatedAt: new Date().toISOString() }).onConflictDoNothing();
}
