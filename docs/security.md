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

La version actuelle utilise un identifiant familial D1 partagé. Une instance publique doit donc rester une démonstration sans données personnelles. Avant une ouverture publique avec de vraies familles, ajouter une identité adaptée, une autorisation serveur par famille, une politique de rétention et une analyse formelle de conformité à la Loi 25.
