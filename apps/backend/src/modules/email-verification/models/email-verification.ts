import { model } from "@medusajs/framework/utils";

export const EmailVerification = model.define("email_verification", {
  id: model.id().primaryKey(),
  email: model.text().searchable(),
  code_hash: model.text(),
  pending_data: model.json(),
  expires_at: model.dateTime(),
  verified: model.boolean().default(false),
});
