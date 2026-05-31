import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  risk: integer("risk").notNull(),
  status: text("status").notNull(),
  summary: text("summary").notNull(),
  signals: jsonb("signals").notNull().default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
