# Modèle de données

## MVP déployé

- `family_states` conserve l'état familial versionné en JSON : profil élève, écoles, maîtrise, erreurs et statistiques.
- `activity_events` est prêt pour les événements analytiques privés : type, matière, compétence, score et durée.

Ce stockage agrégé réduit la complexité du MVP tout en gardant une migration vers un modèle relationnel complet.

## Modèle cible

Le modèle cible comprend `User`, `StudentProfile`, `ParentProfile`, `School`, `SchoolAdmissionProfile`, `AdmissionEvent`, `Subject`, `Skill`, `SubSkill`, `Question`, `QuestionOption`, `Exam`, `ExamSection`, `ExamAttempt`, `Answer`, `SkillMastery`, `StudyPlan`, `StudySession`, `ErrorNotebook`, `Achievement`, `StudentAchievement`, `DailyMission` et `ContentSource`.

Les relations principales sont : un parent gère un ou plusieurs profils; un profil possède plusieurs scores, sessions et candidatures; un examen comprend plusieurs sections et questions; chaque réponse alimente la maîtrise et, au besoin, le carnet d'erreurs.
