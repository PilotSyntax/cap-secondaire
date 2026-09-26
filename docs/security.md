# Sécurité et vie privée

## Protection du mineur

- Collecte minimale : prénom ou pseudonyme, niveau, objectifs, progression et écoles ciblées.
- Aucune publicité, aucun suivi publicitaire et aucune vente de données.
- Le Coach local n’envoie aucune donnée à un fournisseur d’IA. Lorsque Gemini est activé, seule la demande courante explicitement soumise est transmise; le profil, la progression et les écoles suivies ne le sont pas.
- Pour un usage familial réel, le site doit rester protégé par le contrôle d'accès de la plateforme.
- Les données structurées sont conservées dans D1; le navigateur conserve seulement un relais hors connexion.

## Mesures techniques

- Validation minimale des données reçues par l'API.
- Requêtes D1 préparées par Drizzle.
- Aucun secret commité.
- Export explicite initié par le parent.
- Service worker limité aux requêtes GET hors API.
- Vérification cryptographique des jetons Google côté serveur, avec contrôle de l’émetteur, de l’audience, de l’expiration et de l’adresse vérifiée.
- Sessions opaques révocables stockées sous forme de condensats dans D1.
- Progression isolée par identifiant utilisateur; les API de progression et d’IA refusent les requêtes anonymes.

La branche principale utilise encore un identifiant familial D1 partagé. La branche `feature/multi-user-auth` ajoute une identité Google et une autorisation serveur par utilisateur. Avant une ouverture publique avec de vraies familles, compléter la politique de rétention et une analyse formelle de conformité à la Loi 25.
