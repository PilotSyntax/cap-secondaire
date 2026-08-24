import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("le shell contient les métadonnées et l’expérience Cap Secondaire", async () => {
  const [layout, app, aiCoach, aiRoute, frenchWorkshop, installPrompt, manifestSource, serviceWorker] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/cap-secondaire-app.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ai-coach-view.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/ai/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/french-workshop-view.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/install-app-prompt.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  assert.match(layout, /title:\s*"Cap Secondaire"/);
  assert.match(layout, /manifest\.webmanifest/);
  assert.match(layout, /appleWebApp/);
  assert.match(app, /Bonjour/);
  assert.match(app, /MissionView/);
  assert.match(app, /SchoolsView/);
  assert.match(app, /Coach IA/);
  assert.match(app, /AiCoachView/);
  assert.match(app, /Français \+/);
  assert.match(app, /FrenchWorkshopView/);
  assert.match(frenchWorkshop, /Atelier orthographe & conjugaison/);
  assert.match(frenchWorkshop, /speechSynthesis/);
  assert.match(aiCoach, /Génération personnalisée/);
  assert.match(aiCoach, /Comprendre une erreur/);
  assert.match(aiRoute, /generativelanguage\.googleapis\.com/);
  assert.match(aiRoute, /responseFormat/);
  assert.match(aiRoute, /thinkingLevel/);
  assert.match(aiRoute, /safetySettings/);
  assert.match(aiRoute, /GEMINI_API_KEY/);
  assert.match(app, /InstallAppPrompt/);
  assert.match(installPrompt, /beforeinstallprompt/);
  assert.match(installPrompt, /Sur l’écran d’accueil/);
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.icons.length, 2);
  assert.match(serviceWorker, /cap-secondaire-v3/);
});
