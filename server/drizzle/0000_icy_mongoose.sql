CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"image_url" varchar(500),
	"image_public_id" varchar(255),
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_token_hash" varchar(64),
	"verification_token_expiry" timestamp,
	"reset_password_token_hash" varchar(64),
	"reset_password_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "refresh_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hashed_token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"device" varchar(255),
	"ip" varchar(45),
	"revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_verify_token_idx" ON "users" USING btree ("verification_token_hash");--> statement-breakpoint
CREATE INDEX "users_reset_token_idx" ON "users" USING btree ("reset_password_token_hash");--> statement-breakpoint
CREATE INDEX "refresh_user_id_idx" ON "refresh_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_hashed_token_idx" ON "refresh_sessions" USING btree ("hashed_token");--> statement-breakpoint
CREATE INDEX "refresh_expires_idx" ON "refresh_sessions" USING btree ("expires_at");