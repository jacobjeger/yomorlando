import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "YoM Orlando terms of service.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12 md:py-16 prose prose-slate dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: March 2026</p>

      <h2>1. General</h2>
      <p>
        By placing an order through YoM Orlando, you agree to be bound by these Terms of Service.
        YoM Orlando provides services including park ticket sales, villa kashering, and checked lettuce
        distribution for the Orthodox Jewish community visiting Orlando, Florida.
      </p>

      <h2>2. Orders and Payment</h2>
      <p>
        All orders are subject to availability. Prices are listed in US dollars and include applicable fees
        unless otherwise noted. Payment is processed securely through Stripe. A 3% credit card surcharge
        may apply to all transactions.
      </p>

      <h2>3. Park Tickets</h2>
      <ul>
        <li>All ticket sales are final. No refunds or exchanges.</li>
        <li>Fingerprint scanning is required at park entry. The original ticket holder must be present.</li>
        <li>Tickets are non-transferable.</li>
        <li>Visit dates, once selected, cannot be changed.</li>
        <li>Shipping times are estimates and not guaranteed.</li>
      </ul>

      <h2>4. Kashering Services</h2>
      <ul>
        <li>Kashering services are performed according to Orthodox halachic standards.</li>
        <li>Access to the villa must be arranged for the selected access day.</li>
        <li>Cancellations must be made at least 72 hours in advance for a full refund.</li>
        <li>YoM Orlando is not responsible for any damage to kitchen surfaces or appliances during the kashering process.</li>
      </ul>

      <h2>5. Checked Lettuce</h2>
      <ul>
        <li>Lettuce is checked according to Orthodox halachic standards.</li>
        <li>Orders are subject to availability and seasonal supply.</li>
        <li>Delivery is available to select developments only.</li>
        <li>Pickup orders must be collected at the designated time and location.</li>
      </ul>

      <h2>6. Refunds</h2>
      <p>
        Refund policies vary by product type. Park ticket sales are final. Kashering and lettuce orders may
        be eligible for refunds at the discretion of YoM Orlando. Contact us at info@yomorlando.com for
        refund inquiries.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        YoM Orlando acts as an intermediary for park ticket sales and provides kashering and lettuce services
        directly. We are not liable for issues arising from park operations, weather closures, or other
        circumstances beyond our control.
      </p>

      <h2>8. Contact</h2>
      <p>
        For questions about these terms, please contact us at{" "}
        <a href="mailto:info@yomorlando.com">info@yomorlando.com</a>.
      </p>
    </div>
  );
}
