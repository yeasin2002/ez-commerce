"use server";

import { sdk } from "@lib/config";
import { setAuthToken } from "./cookies";
import { transferCart } from "./customer";

export type OtpResultState =
  | { success: true; email: string; message?: string }
  | { success: false; error: string };

export async function requestRegistrationOtp(
  _currentState: unknown,
  formData: FormData
): Promise<OtpResultState> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!email || !first_name || !last_name || !password) {
    return {
      success: false,
      error: "First name, last name, email, and password are required.",
    };
  }

  try {
    const res = await sdk.client.fetch<{
      success: boolean;
      email: string;
      message?: string;
    }>("/store/auth/request-otp", {
      method: "POST",
      body: {
        email,
        first_name,
        last_name,
        phone,
        password,
      },
    });

    if (res && res.success) {
      return {
        success: true,
        email: res.email,
        message: res.message,
      };
    }

    return {
      success: false,
      error: res?.message || "Failed to request verification code.",
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.message ||
        error.data?.message ||
        "An error occurred while requesting OTP.",
    };
  }
}

export async function verifyRegistrationOtp(
  email: string,
  code: string
): Promise<OtpResultState> {
  if (!email || !code) {
    return {
      success: false,
      error: "Email and verification code are required.",
    };
  }

  try {
    const res = await sdk.client.fetch<{
      success: boolean;
      email: string;
      password?: string;
      message?: string;
    }>("/store/auth/verify-otp", {
      method: "POST",
      body: {
        email: email.toLowerCase().trim(),
        code: code.trim(),
      },
    });

    if (!res || !res.success || !res.password) {
      return {
        success: false,
        error: res?.message || "Invalid or expired verification code.",
      };
    }

    // Now complete Medusa auth login to get the JWT token
    const loginRes = await sdk.auth.login("customer", "emailpass", {
      email: res.email,
      password: res.password,
    });

    if (typeof loginRes !== "string") {
      return {
        success: false,
        error: "Failed to authenticate session after verification.",
      };
    }

    // Save JWT token in cookie
    await setAuthToken(loginRes);

    // Transfer guest cart if available
    try {
      await transferCart();
    } catch {
      // Non-blocking error if no cart
    }

    return {
      success: true,
      email: res.email,
      message: "Email verified successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.message ||
        error.data?.message ||
        "An error occurred during verification.",
    };
  }
}

export async function resendRegistrationOtp(
  email: string
): Promise<OtpResultState> {
  if (!email) {
    return { success: false, error: "Email is required." };
  }

  try {
    const res = await sdk.client.fetch<{
      success: boolean;
      email: string;
      message?: string;
    }>("/store/auth/resend-otp", {
      method: "POST",
      body: {
        email: email.toLowerCase().trim(),
      },
    });

    if (res && res.success) {
      return {
        success: true,
        email: res.email,
        message: res.message || "A new code has been sent.",
      };
    }

    return {
      success: false,
      error: res?.message || "Failed to resend verification code.",
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.message ||
        error.data?.message ||
        "An error occurred while resending code.",
    };
  }
}
