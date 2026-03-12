"use server";

import { resend } from "@/lib/email";
import ContactFormEmail from "@/emails/contact-form";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@yomorlando.com";
const FROM_EMAIL = "YoM Orlando <noreply@yomorlando.com>";

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!data.name.trim() || !data.email.trim() || !data.subject.trim() || !data.message.trim()) {
    throw new Error("All fields are required");
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    replyTo: data.email,
    subject: `Contact Form: ${data.subject}`,
    react: ContactFormEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    }),
  });

  return { success: true };
}
