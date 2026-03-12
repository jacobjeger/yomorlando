import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "YoM Orlando privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12 md:py-16 prose prose-slate dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: March 2026</p>

      <h2>1. Information We Collect</h2>
      <p>When you place an order or use our services, we collect:</p>
      <ul>
        <li><strong>Personal information:</strong> Name, email address, phone number, and mailing address.</li>
        <li><strong>Order information:</strong> Products purchased, order amounts, and delivery preferences.</li>
        <li><strong>Payment information:</strong> Payment is processed securely through Stripe. We do not store credit card numbers on our servers.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Process and fulfill your orders.</li>
        <li>Send order confirmations and status updates via email.</li>
        <li>Communicate with you about your orders or inquiries.</li>
        <li>Improve our services and operations.</li>
      </ul>

      <h2>3. Information Sharing</h2>
      <p>
        We do not sell or rent your personal information to third parties. We may share your information with:
      </p>
      <ul>
        <li><strong>Service providers:</strong> Payment processing (Stripe) and email delivery (Resend) services that help us operate our business.</li>
        <li><strong>Legal requirements:</strong> When required by law or to protect our rights.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal information. All payment
        transactions are encrypted and processed through Stripe&apos;s PCI-compliant infrastructure.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your order information for record-keeping and customer service purposes. You may request
        deletion of your personal data by contacting us.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Our website may use essential cookies for authentication and session management. We do not use
        tracking cookies or third-party analytics.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you.</li>
        <li>Request correction of inaccurate information.</li>
        <li>Request deletion of your personal data.</li>
        <li>Opt out of marketing communications.</li>
      </ul>

      <h2>8. Contact</h2>
      <p>
        For privacy-related questions or requests, please contact us at{" "}
        <a href="mailto:info@yomorlando.com">info@yomorlando.com</a>.
      </p>
    </div>
  );
}
