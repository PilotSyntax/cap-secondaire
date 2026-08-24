# Architecture

## Principes

L'architecture vise un coût initial très faible, une seule base de code responsive et un chemin simple vers iOS/Android avec Capacitor. Les fonctions essentielles ne dépendent d'aucun service d'IA.

## Composants

1. L'interface React fournit les vues élève et parent, le moteur de quiz et le mode concentration.
2. `lib/question-bank.ts` génère une banque originale déterministe et validable.
3. `lib/mastery.ts` calcule les scores pondérés et construit la mission quotidienne.
4. `/api/state` lit et écrit l'état familial dans D1.
5. Le service worker met en cache l'interface; un cache local relaie les changements hors connexion avant la prochaine synchronisation.

## Choix de persistance

D1 remplace PostgreSQL/Supabase pour ce déploiement afin d'éviter un fournisseur externe, une configuration de secrets et un coût additionnel. L'API isole la persistance; une migration future vers Supabase reste possible sans réécrire le moteur pédagogique.

## Évolution

- Phase 2 : activités d'écriture avec grille d'autoévaluation, anglais oral, notifications.
- Phase 3 : fournisseur IA optionnel, génération contrôlée de variantes, emballage Capacitor.
