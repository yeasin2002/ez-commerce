"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { mockCustomerProfile } from "@/data/account.data";
import { ProfileAvatarUpload } from "@/feature/account/profile-avatar-upload";
import { CommonInput } from "@/components/shared";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-]{8,20}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender",
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: mockCustomerProfile.fullName,
      phone: mockCustomerProfile.phone,
      email: mockCustomerProfile.email,
      dateOfBirth: mockCustomerProfile.dateOfBirth,
      gender: mockCustomerProfile.gender as "male" | "female",
    },
  });

  const selectedGender = watch("gender");

  const onSubmit = (data: ProfileFormData) => {
    console.log("Saving profile settings:", data);
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-hairline-soft">
        <h1 className="text-4xl font-display uppercase tracking-wider text-ink dark:text-canvas">
          Profile Settings
        </h1>
        <p className="text-xs text-mute mt-1 font-sans">
          Update your personal information and contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Forms */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-8 order-2 md:order-1 space-y-5">
          
          {/* Full Name & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CommonInput 
              label="Full Name" 
              placeholder="Enter your name" 
              error={errors.fullName}
              {...register("fullName")}
            />
            <CommonInput 
              label="Phone Number" 
              placeholder="Enter phone number" 
              error={errors.phone}
              {...register("phone")}
            />
          </div>

          {/* Email Address & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CommonInput 
              label="Email Address" 
              type="email" 
              placeholder="Enter email address" 
              error={errors.email}
              {...register("email")}
            />
            <CommonInput 
              label="Date of Birth" 
              type="date" 
              error={errors.dateOfBirth}
              {...register("dateOfBirth")}
            />
          </div>

          {/* Gender selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-mute block font-sans">
              Gender
            </label>
            <div className="flex gap-6">
              
              {/* Male option */}
              <label className="flex items-center group cursor-pointer select-none">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="male"
                    checked={selectedGender === "male"}
                    onChange={() => setValue("gender", "male")}
                    className="peer h-4.5 w-4.5 appearance-none rounded-full border border-border bg-canvas checked:border-ink focus:outline-none transition-all cursor-pointer"
                  />
                  <div className="absolute h-2 w-2 rounded-full bg-ink scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                </div>
                <span className="text-xs font-semibold text-ink dark:text-canvas ml-2.5 font-sans">
                  Male
                </span>
              </label>

              {/* Female option */}
              <label className="flex items-center group cursor-pointer select-none">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="female"
                    checked={selectedGender === "female"}
                    onChange={() => setValue("gender", "female")}
                    className="peer h-4.5 w-4.5 appearance-none rounded-full border border-border bg-canvas checked:border-ink focus:outline-none transition-all cursor-pointer"
                  />
                  <div className="absolute h-2 w-2 rounded-full bg-ink scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                </div>
                <span className="text-xs font-semibold text-ink dark:text-canvas ml-2.5 font-sans">
                  Female
                </span>
              </label>

            </div>
            {errors.gender && (
              <span className="text-[10px] font-semibold text-sale block mt-1 font-sans">
                {errors.gender.message}
              </span>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-hairline-soft/80 flex justify-start">
            <Button 
              type="submit"
              className="rounded-full bg-ink hover:bg-charcoal text-canvas px-7 py-3 text-xs font-semibold uppercase tracking-wider border-none h-11 shadow-sm cursor-pointer font-sans"
            >
              Save Changes
            </Button>
          </div>

        </form>

        {/* Right Side: Photo widget (Circular) */}
        <div className="md:col-span-4 order-1 md:order-2 flex justify-center py-6 md:py-4 border border-hairline-soft/60 md:border-none rounded-2xl md:rounded-none bg-cloud/5 md:bg-transparent">
          <ProfileAvatarUpload initialAvatarUrl={mockCustomerProfile.avatarUrl} />
        </div>

      </div>

    </div>
  );
}
