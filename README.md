# Cap Secondaire

Application PWA familiale de préparation à l'admission en 1re secondaire au Québec. Elle combine un parcours adaptatif, des exercices originaux alignés sur le PFEQ, des examens blancs, un carnet d'erreurs et un calendrier d'admission fondé sur des sources officielles.

## Fonctionnalités du MVP

- Tableau de bord élève et compte à rebours vers le prochain objectif.
- Smart Study Plan basé sur la maîtrise, la tendance et les erreurs récentes.
- Diagnostic de 24 questions pouvant couvrir 45 à 60 minutes.
- Profil de démonstration réinitialisé avec une progression vierge et aucun établissement sélectionné par défaut.
- Mission quotidienne avec correction pédagogique immédiate.
- Atelier Français+ avec 60 activités interactives : conjugaison, homophones, correction de phrases et mini-dictées audio.
- 19 examens : formats express, révisions par matière, simulations par école et préparation Jour J.
- Carnet d'erreurs avec réintroduction de compétences sous une nouvelle forme.
- Coach hybride sécurisé : explication des erreurs, questions-réponses et exercices personnalisés à la demande.
- Connexion Google, sessions révocables et progression isolée par utilisateur sur la branche `feature/multi-user-auth`.
- Espace Parent, rapport hebdomadaire, profil et export/import JSON.
- Douze écoles préconfigurées; dates, statuts et écoles personnalisées modifiables.
- PWA installable sur iPhone, iPad, Android et ordinateur, avec guide intégré, mode plein écran, cache de l’interface et synchronisation au retour en ligne.
- 440 questions originales et 60 activités de français générées de façon déterministe et validées.

## Architecture

- **Interface :** Next.js, React, TypeScript et CSS responsive.
- **Hébergement :** Sites / Cloudflare Workers.
- **Persistance :** Cloudflare D1 via Drizzle ORM; cache local uniquement comme relais hors connexion.
- **Identité :** vérification cryptographique des jetons Google et sessions opaques stockées sous forme de condensats.
- **PWA :** manifeste, service worker et page de repli hors connexion.
- **IA :** logique locale déterministe toujours disponible, avec bascule facultative vers l’API Gemini `generateContent`. Les sorties distantes sont contraintes par un schéma JSON et les filtres de sécurité sont réglés au niveau strict.

## Développement local

Prérequis : Node.js 22 ou plus récent.

```bash
npm run install:ci
npm run dev
```

L'application utilise le binding D1 logique `DB`. Hors de l'environnement hébergé, l'API retourne les données de démonstration si D1 n'est pas disponible.

## Validation

```bash
npm run lint
npm run build
npm test
node --loader @esbuild-kit/esm-loader scripts/validate-content.ts
```

## Base de données

Le schéma est défini dans `db/schema.ts`. Après une modification :

```bash
npm run db:generate
```

Les migrations générées sont conservées dans `drizzle/` et appliquées par la plateforme au déploiement.

## Configuration IA

Le projet fonctionne sans secret grâce au Coach local. Pour activer la génération à la demande, configurer `GEMINI_API_KEY` comme secret serveur et, facultativement, `GEMINI_MODEL` (valeur par défaut : `gemini-3.5-flash-lite`). Aucun fichier `.env` ne doit être commité et la clé ne doit jamais être exposée au navigateur.

Seuls la question ou le contexte d’erreur explicitement choisi sont envoyés. Le profil complet, les écoles suivies et l’état de progression ne sont jamais inclus dans la requête IA.

Le niveau gratuit de l’API Gemini peut utiliser les requêtes pour améliorer les produits Google. Cette information est affichée dans le Coach afin que l’adulte responsable puisse faire un choix éclairé; aucune donnée d’identité ne doit être saisie.

## Configuration de l’authentification

La branche `feature/multi-user-auth` utilise `GOOGLE_CLIENT_ID`. Les variables facultatives `ALLOWED_USER_EMAILS` et `BOOTSTRAP_USER_EMAIL` permettent respectivement de limiter les comptes autorisés et de transférer l’ancien profil familial lors de la première connexion. Ces valeurs doivent être configurées côté serveur et ne doivent jamais être inscrites dans le dépôt.

## Déploiement

Le dépôt peut être déployé sur Sites / Cloudflare Workers. Le fichier `.openai/hosting.json` propre à chaque déploiement est volontairement ignoré; un modèle est fourni dans `.openai/hosting.example.json`. Pour un usage familial réel, conserver le site en accès privé ou ajouter une identité par famille avant de l’ouvrir au public. Voir `docs/deployment.md`.

## Documentation

- `docs/architecture.md`
- `docs/pedagogy.md`
- `docs/admission-sources.md`
- `docs/data-model.md`
- `docs/content-model.md`
- `docs/security.md`
- `docs/deployment.md`
