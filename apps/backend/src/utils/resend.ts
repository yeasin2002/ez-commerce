export async function sendOtpEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  console.log(`\n==================================================`);
  console.log(`[EMAIL VERIFICATION] OTP Code for ${email}: ${code}`);
  console.log(`==================================================\n`);

  if (!apiKey) {
    console.warn(
      "[Resend] RESEND_API_KEY is not set. OTP code logged to console only."
    );
    return { success: true, simulated: true };
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #ffffff; margin: 0; padding: 40px 20px; }
          .container { max-width: 500px; margin: 0 auto; background: #18181b; border-radius: 16px; border: 1px solid #27272a; padding: 32px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; tracking-tight: -0.05em; text-transform: uppercase; color: #ffffff; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #f4f4f5; }
          .subtitle { font-size: 14px; color: #a1a1aa; line-height: 1.5; margin-bottom: 28px; }
          .otp-box { background: #000000; border: 1px solid #6a35f2; border-radius: 12px; padding: 20px; font-size: 32px; font-weight: 800; letter-spacing: 0.3em; color: #a855f7; margin-bottom: 28px; display: inline-block; width: 80%; }
          .footer { font-size: 12px; color: #71717a; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">EZ COMMERCE</div>
          <div class="title">Verify Your Email Address</div>
          <div class="subtitle">Please use the following 6-digit verification code to complete your registration. This code is valid for 10 minutes.</div>
          <div class="otp-box">${code}</div>
          <div class="subtitle">If you didn't request this code, you can safely ignore this email.</div>
          <div class="footer">&copy; ${new Date().getFullYear()} EZ Commerce. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: `${code} is your ez-commerce verification code`,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Resend Error]", res.status, errorText);
      throw new Error(`Failed to send email via Resend: ${res.statusText}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("[Resend Exception]", error);
    throw error;
  }
}
