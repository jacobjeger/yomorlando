import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with YoM Orlando.",
};

export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-12 md:py-16">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">
        Have a question or need help? Send us a message and we&apos;ll get back to you as soon as possible.
      </p>

      <div className="mb-8 space-y-2 text-sm">
        <p><strong>Email:</strong> info@yomorlando.com</p>
      </div>

      <ContactForm />
    </div>
  );
}
