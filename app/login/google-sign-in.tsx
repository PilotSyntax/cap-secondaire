"use client";

import { useEffect, useRef, useState } from "react";

type GoogleCredentialResponse = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(options: { client_id: string; callback: (response: GoogleCredentialResponse) => void; auto_select?: boolean }): void;
          renderButton(element: HTMLElement, options: Record<string, string | number | boolean>): void;
        };
      };
    };
  }
}

export function GoogleSignIn({ clientId }: { clientId: string }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;
    const initialize = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        auto_select: false,
        callback: async ({ credential }) => {
          if (!credential) return;
          setBusy(true);
          setError("");
          try {
            const response = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential }),
            });
            const result = await response.json() as { error?: string };
            if (!response.ok) throw new Error(result.error || "Connexion impossible");
            window.location.assign("/");
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Connexion impossible");
            setBusy(false);
          }
        },
      });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, { type: "standard", theme: "outline", size: "large", shape: "pill", text: "continue_with", locale: "fr", width: 320 });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]');
    if (existing) { initialize(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = initialize;
    script.onerror = () => setError("Le service Google est temporairement indisponible.");
    document.head.appendChild(script);
  }, [clientId]);

  if (!clientId) return <p className="login-config-note">La connexion Google doit être activée par l’administrateur.</p>;
  return <div className="google-login-wrap" aria-live="polite"><div ref={buttonRef} aria-label="Continuer avec Google" />{busy && <span>Connexion sécurisée…</span>}{error && <p className="login-error" role="alert">{error}</p>}</div>;
}
