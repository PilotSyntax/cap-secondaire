import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  provider: text("provider").notNull(),
  providerSubject: text("provider_subject").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
  lastLoginAt: text("last_login_at").notNull(),
}, (table) => [
  uniqueIndex("users_email_unique").on(table.email),
  uniqueIndex("users_provider_subject_unique").on(table.provider, table.providerSubject),
]);

export const authSessions = sqliteTable("auth_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("auth_sessions_user_idx").on(table.userId),
  index("auth_sessions_expiry_idx").on(table.expiresAt),
]);

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
