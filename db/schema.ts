import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const familyStates = sqliteTable("family_states", {
  id: text("id").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const activityEvents = sqliteTable("activity_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  familyId: text("family_id").notNull(),
  eventType: text("event_type").notNull(),
  subject: text("subject"),
  skill: text("skill"),
  score: integer("score"),
  durationSeconds: integer("duration_seconds"),
  createdAt: text("created_at").notNull(),
});
