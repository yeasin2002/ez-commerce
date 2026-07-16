"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconShield, IconDeviceLaptop, IconLock } from "@tabler/icons-react";
import { CommonInput } from "@/components/shared";
import { Button } from "@/components/ui/button";

const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(1, "New password is required")
    .min(8, "New password must be at least 8 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecuritySettingsPage() {
  const [is2faEnabled, setIs2faEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormData) => {
    console.log("Updating account password:", data);
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-hairline-soft">
        <h1 className="text-4xl font-display uppercase tracking-wider text-ink dark:text-canvas">
          Security Settings
        </h1>
        <p className="text-xs text-mute mt-1 font-sans">
          Change your password and keep your account secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-7 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-canvas border-b border-hairline-soft/80 pb-3 mb-4 font-sans flex items-center gap-2">
            <IconLock size={16} />
            <span>Change Password</span>
          </h3>

          <CommonInput 
            label="Current Password" 
            type="password" 
            placeholder="Enter current password" 
            error={errors.currentPassword}
            {...register("currentPassword")}
          />

          <CommonInput 
            label="New Password" 
            type="password" 
            placeholder="Enter new password" 
            error={errors.newPassword}
            {...register("newPassword")}
          />

          <CommonInput 
            label="Confirm New Password" 
            type="password" 
            placeholder="Re-enter new password" 
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />

          <div className="pt-2">
            <Button 
              type="submit"
              className="rounded-full bg-ink hover:bg-charcoal text-canvas px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-none h-11 shadow-sm cursor-pointer font-sans"
            >
              Update Password
            </Button>
          </div>
        </form>

        {/* Right Side: 2FA and Sessions Card */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Card 1: Two Factor Authentication */}
          <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-cloud/50 dark:bg-zinc-900 text-ink/75 dark:text-canvas/75 flex items-center justify-center shrink-0">
                <IconShield size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-ink dark:text-canvas uppercase tracking-wide font-sans leading-none">
                  Two-Factor Authentication
                </h4>
                <p className="text-[10px] text-mute font-sans leading-relaxed">
                  Add an extra layer of security to your account.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-cloud/20 dark:bg-zinc-900/20 p-3.5 rounded-xl border border-hairline-soft/80">
              <span className="text-[10px] text-mute font-extrabold uppercase tracking-widest font-sans">
                Status
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-sans border",
                is2faEnabled 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-red-50 text-sale border-red-100"
              )}>
                {is2faEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            <Button 
              type="button"
              onClick={() => setIs2faEnabled(prev => !prev)}
              className="w-full rounded-full border border-hairline hover:bg-cloud/50 hover:text-ink dark:hover:bg-zinc-900 text-xs font-semibold py-2 h-10 cursor-pointer font-sans"
            >
              {is2faEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>

          {/* Card 2: Login Sessions */}
          <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-cloud/50 dark:bg-zinc-900 text-ink/75 dark:text-canvas/75 flex items-center justify-center shrink-0">
                <IconDeviceLaptop size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-ink dark:text-canvas uppercase tracking-wide font-sans leading-none">
                  Login Devices
                </h4>
                <p className="text-[10px] text-mute font-sans leading-relaxed">
                  Manage the devices where you are logged in.
                </p>
              </div>
            </div>

            <Button 
              type="button"
              className="w-full rounded-full border border-hairline hover:bg-cloud/50 hover:text-ink dark:hover:bg-zinc-900 text-xs font-semibold py-2 h-10 cursor-pointer font-sans"
            >
              Manage Devices
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
