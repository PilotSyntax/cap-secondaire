import { authEnvironment, createSession, isAllowedEmail, migrateLegacyStateForBootstrapUser, upsertGoogleUser } from "../../../../lib/auth-server";
import { verifyGoogleCredential } from "../../../../lib/google-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "Origine non autorisée" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const clientId = authEnvironment().GOOGLE_CLIENT_ID;
  if (!clientId) return Response.json({ error: "Connexion Google non configurée" }, { status: 503 });
  let credential = "";
  try {
    const payload = await request.json() as { credential?: unknown };
    if (typeof payload.credential === "string") credential = payload.credential;
  } catch {
    return Response.json({ error: "Demande invalide" }, { status: 400 });
  }
  const identity = await verifyGoogleCredential(credential, clientId);
  if (!identity) return Response.json({ error: "Identité Google invalide" }, { status: 401 });
  if (!isAllowedEmail(identity.email)) return Response.json({ error: "Ce compte n’est pas autorisé" }, { status: 403 });
  const user = await upsertGoogleUser(identity);
  await migrateLegacyStateForBootstrapUser(user);
  const session = await createSession(user.id);
  return Response.json({ ok: true, user: { displayName: user.displayName } }, {
    headers: { "Cache-Control": "no-store", "Set-Cookie": session.cookie },
  });
}
