import { MedusaService } from "@medusajs/framework/utils";
import { EmailVerification } from "./models/email-verification";

class EmailVerificationModuleService extends MedusaService({
  EmailVerification,
}) {}

export default EmailVerificationModuleService;
