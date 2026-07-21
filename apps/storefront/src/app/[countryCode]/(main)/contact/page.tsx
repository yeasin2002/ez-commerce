"use client";

import { CommonInput } from "@/components/shared";
import { Footer } from "@/feature/home/Footer";
import { Header } from "@/feature/home/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  Clock,
  HelpCircle,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form Validation Schema using Zod
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
  agreeToPolicy: z.literal(true, {
    message: "You must agree to the Privacy Policy",
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactUsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Contact form submitted:", data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-background text-ink dark:text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-grow flex-1 bg-canvas dark:bg-background py-8">
        {/* Breadcrumb */}
        <div className="container-page border-b border-hairline-soft dark:border-border pb-4 mb-8 text-xs text-mute">
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-ink dark:hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-ink dark:text-foreground font-semibold">
              Contact Us
            </span>
          </nav>
        </div>

        {/* Page Title & Subtitle */}
        <div className="container-page max-w-3xl text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight">
            Contact Us
          </h1>
          <p className="mt-3 text-sm text-mute leading-relaxed max-w-xl mx-auto">
            Please use the form below to get in touch. You can also reach our
            customer support team directly at{" "}
            <span className="font-bold text-ink dark:text-foreground whitespace-nowrap">
              +1 (832) 387-6391
            </span>
            .
          </p>
        </div>

        {/* Layout Grid */}
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 pb-16">
          {/* Left Column: Support info */}
          <div className="space-y-6">
            <div className="bg-cloud/30 dark:bg-card border border-hairline-soft dark:border-border rounded-2xl p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-wide">
                  Support Customer
                </h2>
                <p className="mt-2 text-xs text-mute leading-relaxed">
                  Have a question or need assistance with your order? Our
                  customer support agents are ready to assist you.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-hairline-soft dark:border-border">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-cloud dark:bg-muted rounded-full text-ink dark:text-foreground shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-mute">
                      Customer Care
                    </h3>
                    <p className="text-sm font-medium mt-1">
                      +1 (832) 387-6391
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-cloud dark:bg-muted rounded-full text-ink dark:text-foreground shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-mute">
                      Email
                    </h3>
                    <p className="text-sm font-medium mt-1">
                      FootyStyleHub@gmail.com
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-cloud dark:bg-muted rounded-full text-ink dark:text-foreground shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-mute">
                      Opening Hours
                    </h3>
                    <p className="text-sm font-medium mt-1">24/7 Service</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium FAQ Tip block */}
            <div className="bg-ink dark:bg-card text-canvas dark:text-foreground border border-transparent dark:border-border rounded-2xl p-6 md:p-8 flex gap-4 items-start">
              <HelpCircle className="h-6 w-6 text-canvas dark:text-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  Quick Response Time
                </h4>
                <p className="text-xs text-canvas/70 dark:text-muted-foreground mt-1 leading-relaxed">
                  We typically reply to all email inquiries within 2 hours. For
                  immediate support, please give us a call.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="bg-canvas dark:bg-card border border-hairline-soft dark:border-border rounded-2xl p-6 md:p-8">
            {isSubmitted ? (
              // Success Screen
              <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                <div className="h-16 w-16 bg-sale/10 text-sale rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="font-display text-3xl uppercase">Thank You!</h2>
                <p className="text-xs text-mute leading-relaxed">
                  Your message has been sent successfully. One of our customer
                  service representatives will contact you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 border border-hairline dark:border-border hover:bg-cloud dark:hover:bg-muted text-ink dark:text-foreground px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              // Form Screen
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-wide">
                    Contact Us
                  </h2>
                  <p className="mt-2 text-xs text-mute leading-relaxed">
                    Please submit all general enquiries in the contact form
                    below and we look forward to hearing from you soon.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <CommonInput
                    label="Your Name"
                    placeholder="e.g. John Doe"
                    error={errors.name}
                    {...register("name")}
                  />

                  {/* Email field */}
                  <CommonInput
                    label="Your Email"
                    placeholder="e.g. john@example.com"
                    type="email"
                    error={errors.email}
                    {...register("email")}
                  />
                </div>

                {/* Message field */}
                <CommonInput
                  label="Your Message"
                  placeholder="Enter please your message"
                  textarea
                  error={errors.message}
                  {...register("message")}
                />

                {/* Privacy Policy Checkbox */}
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("agreeToPolicy")}
                      className="mt-1 shrink-0 rounded border-hairline dark:border-border accent-ink dark:accent-foreground h-3.5 w-3.5 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    />
                    <span className="text-xs text-charcoal dark:text-stone leading-snug">
                      I agree to the{" "}
                      <Link
                        href="/"
                        className="underline hover:text-ink dark:hover:text-foreground transition-colors"
                      >
                        Privacy Policy
                      </Link>{" "}
                      of the website.
                    </span>
                  </label>
                  {errors.agreeToPolicy && (
                    <span className="text-[10px] font-semibold text-sale flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {errors.agreeToPolicy.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-ink dark:bg-primary hover:bg-charcoal dark:hover:bg-primary/95 text-canvas dark:text-primary-foreground px-8 py-3 rounded-full font-semibold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
