import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import crypto from "crypto";
import { EMAIL_VERIFICATION_MODULE } from "../../../../modules/email-verification";
import EmailVerificationModuleService from "../../../../modules/email-verification/service";
import { sendOtpEmail } from "../../../../utils/resend";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { email, first_name, last_name, phone, password } = req.body as any;

    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({
        message: "First name, last name, email, and password are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const customerModuleService = req.scope.resolve("customer") as any;

    // Check if customer profile already exists in Medusa
    const existingCustomers = await customerModuleService
      .listCustomers({ email: cleanEmail })
      .catch(() => []);

    if (existingCustomers && existingCustomers.length > 0) {
      return res.status(400).json({
        message: "An account with this email address already exists.",
      });
    }

    const emailVerificationService: EmailVerificationModuleService =
      req.scope.resolve(EMAIL_VERIFICATION_MODULE);

    // Generate 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code_hash = crypto.createHash("sha256").update(code).digest("hex");
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const pending_data = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : "",
      password,
    };

    // Find existing pending verification or create new one
    const existingVerifications = await emailVerificationService.listEmailVerifications({
      email: cleanEmail,
    });

    if (existingVerifications.length > 0) {
      await emailVerificationService.updateEmailVerifications({
        id: existingVerifications[0].id,
        code_hash,
        pending_data,
        expires_at,
        verified: false,
      });
    } else {
      await emailVerificationService.createEmailVerifications({
        email: cleanEmail,
        code_hash,
        pending_data,
        expires_at,
        verified: false,
      });
    }

    // Send Email via Resend (or log to console)
    await sendOtpEmail({ email: cleanEmail, code });

    return res.status(200).json({
      success: true,
      email: cleanEmail,
      message: "Verification code sent to your email.",
    });
  } catch (error: any) {
    console.error("Error in request-otp:", error);
    return res.status(500).json({
      message: error.message || "An error occurred while requesting OTP.",
    });
  }
}
