# Déploiement

Le projet peut être déployé sur Sites / Cloudflare Workers avec un binding D1 logique `DB`.

Copier `.openai/hosting.example.json` vers `.openai/hosting.json`, puis remplacer `YOUR_SITES_PROJECT_ID` par l’identifiant créé par la plateforme. Ce fichier local est ignoré par Git afin de ne pas lier un clone à un déploiement existant.

## Contrôles avant publication

1. Exécuter le lint et la validation de contenu.
2. Générer une migration Drizzle après tout changement de schéma.
3. Vérifier la compilation de production.
4. Pour un usage familial réel, confirmer l'accès privé du site ou mettre en place une identité séparée par famille.
5. Vérifier l'installation PWA sur iPad et Android.

## PWA

Le manifeste est dans `public/manifest.webmanifest`, le service worker dans `public/sw.js` et la page de repli dans `app/offline/page.tsx`.

## Authentification Google

1. Créer un identifiant OAuth 2.0 de type « application Web » dans Google Cloud.
2. Ajouter l’origine HTTPS du site aux origines JavaScript autorisées.
3. Configurer `GOOGLE_CLIENT_ID` comme variable serveur du Site.
4. Pour un accès sur invitation, configurer `ALLOWED_USER_EMAILS` avec les adresses autorisées séparées par des virgules.
5. Pour transférer l’ancien profil familial à un compte précis lors de sa première connexion, configurer `BOOTSTRAP_USER_EMAIL` côté serveur. Ne jamais inscrire cette adresse dans le dépôt public.

Les sessions sont stockées sous forme de condensats dans D1, expirent après 30 jours et utilisent un témoin `HttpOnly`, `Secure` et `SameSite=Lax`.

## Limites du MVP

La branche principale utilise encore un seul enregistrement familial D1. La branche `feature/multi-user-auth` ajoute l’isolation par utilisateur. Une distribution via App Store/Google Play exige également un emballage tel que Capacitor.
