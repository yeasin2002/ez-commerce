import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import crypto from "crypto";
import { EMAIL_VERIFICATION_MODULE } from "../../../../modules/email-verification";
import EmailVerificationModuleService from "../../../../modules/email-verification/service";
import { sendOtpEmail } from "../../../../utils/resend";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { email } = req.body as any;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const emailVerificationService: EmailVerificationModuleService =
      req.scope.resolve(EMAIL_VERIFICATION_MODULE);

    const verifications = await emailVerificationService.listEmailVerifications({
      email: cleanEmail,
    });

    if (!verifications || verifications.length === 0) {
      return res.status(400).json({
        message: "No pending registration found for this email address.",
      });
    }

    const record = verifications[0];

    // Generate fresh 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code_hash = crypto.createHash("sha256").update(code).digest("hex");
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await emailVerificationService.updateEmailVerifications({
      id: record.id,
      code_hash,
      expires_at,
      verified: false,
    });

    // Send fresh email via Resend
    await sendOtpEmail({ email: cleanEmail, code });

    return res.status(200).json({
      success: true,
      email: cleanEmail,
      message: "A new verification code has been sent to your email.",
    });
  } catch (error: any) {
    console.error("Error in resend-otp:", error);
    return res.status(500).json({
      message: error.message || "An error occurred while resending code.",
    });
  }
}
