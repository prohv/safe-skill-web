import { pgTable, text, integer, boolean } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull().default([]),
  riskScore: integer("risk_score").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
});
