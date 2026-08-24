"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallAppPrompt({ visible }: { visible: boolean }) {
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    queueMicrotask(() => {
      setInstalled(standalone);
      setIsIOS(ios);
      setReady(true);
    });

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setShowInstructions(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowInstructions(false);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  if (!ready || installed || dismissed || !visible) return null;

  return (
    <>
      <aside className="install-banner" aria-label="Installer Cap Secondaire">
        <div className="install-app-icon" aria-hidden="true">C</div>
        <div className="install-banner-copy">
          <strong>Installer Cap Secondaire</strong>
          <span>Accès rapide, plein écran et révision même hors connexion.</span>
        </div>
        <button type="button" className="install-button" onClick={() => void install()}>
          {deferredPrompt ? "Installer" : isIOS ? "Voir les étapes" : "Instructions"}
        </button>
        <button type="button" className="install-dismiss" onClick={() => setDismissed(true)} aria-label="Masquer la proposition d’installation">×</button>
      </aside>

      {showInstructions && <div className="install-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowInstructions(false); }}>
        <section className="install-modal card" role="dialog" aria-modal="true" aria-labelledby="install-title">
          <button type="button" className="install-modal-close" onClick={() => setShowInstructions(false)} aria-label="Fermer">×</button>
          <div className="install-app-icon large" aria-hidden="true">C</div>
          <p className="eyebrow">Application installable</p>
          <h2 id="install-title">Ajouter Cap Secondaire à ton appareil</h2>
          {isIOS ? <ol className="install-steps">
            <li><span>1</span><div><strong>Ouvre le site dans Safari</strong><p>L’installation doit être lancée depuis Safari sur iPhone ou iPad.</p></div></li>
            <li><span>2</span><div><strong>Touche le bouton Partager</strong><p>Le carré avec une flèche vers le haut se trouve dans la barre Safari.</p></div></li>
            <li><span>3</span><div><strong>Choisis « Sur l’écran d’accueil »</strong><p>Puis confirme avec « Ajouter » en haut à droite.</p></div></li>
          </ol> : <ol className="install-steps">
            <li><span>1</span><div><strong>Ouvre le menu du navigateur</strong><p>Dans Chrome ou Edge, sélectionne le menu ⋮ en haut à droite.</p></div></li>
            <li><span>2</span><div><strong>Choisis « Installer Cap Secondaire »</strong><p>Selon l’appareil, l’option peut aussi s’appeler « Ajouter à l’écran d’accueil ».</p></div></li>
            <li><span>3</span><div><strong>Confirme l’installation</strong><p>L’application apparaîtra avec les autres applications de l’appareil.</p></div></li>
          </ol>}
          <button type="button" className="primary-button full-button" onClick={() => setShowInstructions(false)}>J’ai compris</button>
        </section>
      </div>}
    </>
  );
}
