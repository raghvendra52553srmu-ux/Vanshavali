"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { useSonner } from "@/hooks/useSonner";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPageClient() {
  const { success, error } = useSonner();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    success("Message sent successfully!", "We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <div
      className="min-h-screen pt-24 pb-24"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24"
        >
          {/* Left: Info */}
          <div>
            <motion.p
              variants={fadeInUp}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--color-accent)" }}
            >
              Get in touch
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-light mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
            >
              We&apos;d love to hear
              <br />
              <span className="text-gradient italic">from you</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-base mb-12"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Whether you have a question about features, trials, pricing, or anything
              else, our team is ready to answer all your questions.
            </motion.p>

            <motion.div variants={staggerContainer} className="space-y-8">
              {[
                {
                  icon: MapPin,
                  title: "Office",
                  details: ["Vanshavali Technologies", "Cyber City, DLF Phase 2", "Gurugram, Haryana 122002"],
                },
                {
                  icon: Mail,
                  title: "Email",
                  details: ["support@vanshavali.in", "hello@vanshavali.in"],
                },
                {
                  icon: Phone,
                  title: "Phone",
                  details: ["+91 98765 43210", "Mon-Fri from 9am to 6pm"],
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} variants={fadeInUp} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(109,76,65,0.08)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--color-text)" }}
                      >
                        {item.title}
                      </h3>
                      {item.details.map((detail) => (
                        <p
                          key={detail}
                          className="text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div variants={scaleIn}>
            <div
              className="rounded-3xl p-8 sm:p-10 border"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[var(--color-accent-secondary)] focus:border-transparent ${
                      errors.name && touchedFields.name
                        ? "border-[var(--color-error)]"
                        : "border-[var(--color-border)]"
                    }`}
                    style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }}
                    placeholder="Aditya Sharma"
                  />
                  {errors.name && (
                    <p className="text-xs" style={{ color: "var(--color-error)" }}>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[var(--color-accent-secondary)] focus:border-transparent ${
                      errors.email && touchedFields.email
                        ? "border-[var(--color-error)]"
                        : "border-[var(--color-border)]"
                    }`}
                    style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }}
                    placeholder="aditya@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs" style={{ color: "var(--color-error)" }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="subject"
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    id="subject"
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[var(--color-accent-secondary)] focus:border-transparent ${
                      errors.subject && touchedFields.subject
                        ? "border-[var(--color-error)]"
                        : "border-[var(--color-border)]"
                    }`}
                    style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }}
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="text-xs" style={{ color: "var(--color-error)" }}>
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[var(--color-accent-secondary)] focus:border-transparent resize-none ${
                      errors.message && touchedFields.message
                        ? "border-[var(--color-error)]"
                        : "border-[var(--color-border)]"
                    }`}
                    style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }}
                    placeholder="Tell us a little more about what you need..."
                  />
                  {errors.message && (
                    <p className="text-xs" style={{ color: "var(--color-error)" }}>
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70"
                  style={{ background: "var(--color-accent)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
