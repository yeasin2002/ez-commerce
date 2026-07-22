import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import crypto from "crypto";
import { EMAIL_VERIFICATION_MODULE } from "../../../../modules/email-verification";
import EmailVerificationModuleService from "../../../../modules/email-verification/service";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { email, code } = req.body as any;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    const emailVerificationService: EmailVerificationModuleService =
      req.scope.resolve(EMAIL_VERIFICATION_MODULE);

    const verifications = await emailVerificationService.listEmailVerifications({
      email: cleanEmail,
    });

    if (!verifications || verifications.length === 0) {
      return res.status(400).json({
        message: "No pending verification found for this email address.",
      });
    }

    const record = verifications[0];

    // Check expiration
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Verify OTP code hash
    const inputHash = crypto.createHash("sha256").update(cleanCode).digest("hex");
    if (inputHash !== record.code_hash) {
      return res.status(400).json({
        message: "Invalid verification code. Please check and try again.",
      });
    }

    const pendingData = record.pending_data as any;

    const authModuleService = req.scope.resolve("auth") as any;
    const customerModuleService = req.scope.resolve("customer") as any;
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK) as any;

    // Check if customer profile exists for this email
    const existingCustomers = await customerModuleService
      .listCustomers({ email: cleanEmail })
      .catch(() => []);

    // Check if auth identity exists
    const existingIdentities = await authModuleService
      .listAuthIdentities({
        provider_identities: {
          entity_id: cleanEmail,
          provider: "emailpass",
        },
      })
      .catch(() => []);

    // If stale auth identity exists without a customer profile (from previous failed attempt), remove it
    if (
      existingIdentities &&
      existingIdentities.length > 0 &&
      (!existingCustomers || existingCustomers.length === 0)
    ) {
      for (const identity of existingIdentities) {
        await authModuleService.deleteAuthIdentities([identity.id]).catch(() => {});
      }
    }

    // Register Auth Identity using emailpass provider so password is properly hashed
    let authIdentity;
    try {
      const registerRes = await authModuleService.register("emailpass", {
        entity_id: cleanEmail,
        body: {
          email: cleanEmail,
          password: pendingData.password,
        },
      });
      authIdentity = registerRes.authIdentity || registerRes;
    } catch (err: any) {
      const existing = await authModuleService.listAuthIdentities({
        provider_identities: {
          entity_id: cleanEmail,
          provider: "emailpass",
        },
      });
      if (existing && existing.length > 0) {
        authIdentity = existing[0];
      } else {
        throw err;
      }
    }

    // Create Customer profile if it doesn't already exist
    let customer;
    if (existingCustomers && existingCustomers.length > 0) {
      customer = existingCustomers[0];
    } else {
      customer = await customerModuleService.createCustomers({
        email: cleanEmail,
        first_name: pendingData.first_name,
        last_name: pendingData.last_name,
        phone: pendingData.phone || "",
        has_account: true,
      });
    }

    // Link customer actor_id to Auth Identity via app_metadata AND Medusa Remote Link
    if (authIdentity && customer) {
      await authModuleService
        .updateAuthIdentities({
          id: authIdentity.id,
          app_metadata: {
            customer_id: customer.id,
          },
        })
        .catch(() => {});

      try {
        await remoteLink.create({
          [Modules.AUTH]: {
            auth_identity_id: authIdentity.id,
          },
          [Modules.CUSTOMER]: {
            customer_id: customer.id,
          },
        });
      } catch (linkError) {
        // Non-fatal if remote link already exists
      }
    }

    // Mark verification as verified
    await emailVerificationService.updateEmailVerifications({
      id: record.id,
      verified: true,
    });

    return res.status(200).json({
      success: true,
      email: cleanEmail,
      password: pendingData.password,
      customer_id: customer.id,
      message: "Email verified successfully.",
    });
  } catch (error: any) {
    console.error("Error in verify-otp:", error);
    return res.status(500).json({
      message: error.message || "An error occurred during verification.",
    });
  }
}
