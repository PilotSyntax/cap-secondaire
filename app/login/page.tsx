import { env } from "cloudflare:workers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth-current";
import { GoogleSignIn } from "./google-sign-in";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  const variables = env as unknown as { GOOGLE_CLIENT_ID?: string };
  return <main className="login-page"><section className="login-card" aria-labelledby="login-title"><div className="login-brand"><div className="brand-mark" aria-hidden="true">C</div><div><strong>Cap Secondaire</strong><span>Un espace personnel et sécurisé</span></div></div><div className="login-copy"><p className="eyebrow">Connexion familiale</p><h1 id="login-title">Retrouve ta progression</h1><p>Chaque élève dispose de son propre parcours, de ses exercices et de son calendrier d’admission.</p></div><GoogleSignIn clientId={variables.GOOGLE_CLIENT_ID ?? ""} /><div className="login-trust"><span>✓ Progression isolée par compte</span><span>✓ Session sécurisée pendant 30 jours</span><span>✓ Aucune clé Google stockée dans le navigateur</span></div></section></main>;
}
