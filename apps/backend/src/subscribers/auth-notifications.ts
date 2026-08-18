import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"

export default async function authNotificationSubscriber({
  event: { name, data },
}: SubscriberArgs<Record<string, unknown>>) {
  const timestamp = new Date().toLocaleTimeString()

  console.log("\n\x1b[35m============================================================\x1b[0m")
  console.log(`\x1b[1m\x1b[36m⚡ [MEDUSA AUTH EVENT]\x1b[0m \x1b[90m(${timestamp})\x1b[0m`)
  console.log(`\x1b[33mEvent Name:\x1b[0m \x1b[1m${name}\x1b[0m`)
  
  if (data?.entity_id) {
    console.log(`\x1b[32mTarget Identity / Email:\x1b[0m \x1b[1m\x1b[97m${data.entity_id}\x1b[0m`)
  }

  if (data?.actor_type) {
    console.log(`\x1b[90mActor Type:\x1b[0m ${data.actor_type}`)
  }

  if (data?.token) {
    console.log(`\x1b[32m🔑 Auth / Reset Token:\x1b[0m`)
    console.log(`\x1b[44m\x1b[97m\x1b[1m ${data.token} \x1b[0m`)
  }

  if (data?.code) {
    console.log(`\x1b[32m🔢 Verification Code / OTP:\x1b[0m`)
    console.log(`\x1b[42m\x1b[30m\x1b[1m ${data.code} \x1b[0m`)
  }

  if (data?.url) {
    console.log(`\x1b[34m🔗 Verification URL:\x1b[0m ${data.url}`)
  }

  console.log("\x1b[90mData payload:\x1b[0m", JSON.stringify(data, null, 2))
  console.log("\x1b[35m============================================================\x1b[0m\n")
}

export const config: SubscriberConfig = {
  event: [
    "auth.password_reset",
    "auth.verification_requested",
    "auth.mfa_challenge_requested",
  ],
}
