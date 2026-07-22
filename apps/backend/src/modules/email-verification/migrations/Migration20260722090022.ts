import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260722090022 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "email_verification" ("id" text not null, "email" text not null, "code_hash" text not null, "pending_data" jsonb not null, "expires_at" timestamptz not null, "verified" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "email_verification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_email_verification_deleted_at" ON "email_verification" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "email_verification" cascade;`);
  }

}
