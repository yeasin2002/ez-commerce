import { Module } from "@medusajs/framework/utils";
import EmailVerificationModuleService from "./service";

export const EMAIL_VERIFICATION_MODULE = "emailVerification";

export default Module(EMAIL_VERIFICATION_MODULE, {
  service: EmailVerificationModuleService,
});
