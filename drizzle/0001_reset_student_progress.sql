DELETE FROM `activity_events` WHERE `family_id` = 'cap-secondaire-family';
--> statement-breakpoint
DELETE FROM `family_states` WHERE `id` = 'cap-secondaire-family';
--> statement-breakpoint
INSERT INTO `family_states` (`id`, `payload`, `updated_at`) VALUES (
  'cap-secondaire-family',
  '{"dataVersion":2,"student":{"name":"Élève","grade":"6e année","dailyTarget":35,"xp":0,"streak":0,"weeklyMinutes":0},"selectedSchoolIds":[],"schoolStatuses":{},"schoolDateOverrides":{},"customSchools":[],"mastery":[{"id":"reading","subject":"Français","label":"Compréhension implicite","score":0,"trend":0},{"id":"fractions","subject":"Mathématiques","label":"Fractions","score":0,"trend":0},{"id":"grammar","subject":"Français","label":"Accords dans le GN","score":0,"trend":0},{"id":"problems","subject":"Mathématiques","label":"Problèmes à étapes","score":0,"trend":0},{"id":"logic","subject":"Logique","label":"Déduction","score":0,"trend":0},{"id":"english","subject":"Anglais","label":"Reading & vocabulary","score":0,"trend":0}],"errors":[],"completedQuestions":0,"correctAnswers":0,"diagnosticComplete":false,"lastUpdated":"2026-08-23T16:00:00-04:00"}',
  '2026-08-23T16:00:00-04:00'
);
