ALTER TABLE "invites" DROP CONSTRAINT "invites_invitee_id_team_id";--> statement-breakpoint
ALTER TABLE "scans" DROP CONSTRAINT "scans_user_id_event_id";--> statement-breakpoint
ALTER TABLE "profile_data" ALTER COLUMN "skills" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_invitee_id_team_id_pk" PRIMARY KEY("invitee_id","team_id");--> statement-breakpoint
ALTER TABLE "scans" ADD CONSTRAINT "scans_user_id_event_id_pk" PRIMARY KEY("user_id","event_id");--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "points" integer DEFAULT 0 NOT NULL;