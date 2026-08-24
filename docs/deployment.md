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

## Limites du MVP

La version actuelle utilise un seul enregistrement familial D1. Un site public ne doit donc servir que de démonstration sans données personnelles. Un usage public multi-famille ou une distribution via App Store/Google Play exige une stratégie d'identité familiale et, pour les boutiques mobiles, un emballage tel que Capacitor.
