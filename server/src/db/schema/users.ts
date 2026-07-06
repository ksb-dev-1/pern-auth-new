import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    imagePublicId: varchar("image_public_id", { length: 255 }),
    isVerified: boolean("is_verified").default(false).notNull(),
    // Verification
    verificationTokenHash: varchar("verification_token_hash", {
      length: 64,
    }),
    verificationTokenExpiry: timestamp("verification_token_expiry"),
    // Password reset
    resetPasswordTokenHash: varchar("reset_password_token_hash", {
      length: 64,
    }),
    resetPasswordExpiry: timestamp("reset_password_expiry"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_verify_token_idx").on(table.verificationTokenHash),
    index("users_reset_token_idx").on(table.resetPasswordTokenHash),
  ],
);
