import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const refreshSessions = pgTable(
  "refresh_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    hashedToken: varchar("hashed_token", { length: 255 }).notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    device: varchar("device", { length: 255 }),

    ip: varchar("ip", { length: 45 }),

    revoked: boolean("revoked").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("refresh_user_id_idx").on(table.userId),
    index("refresh_hashed_token_idx").on(table.hashedToken),
    index("refresh_expires_idx").on(table.expiresAt),
  ],
);
