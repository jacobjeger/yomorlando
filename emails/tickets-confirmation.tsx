import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface TicketItem {
  parkName: string;
  optionLabel: string;
  ageCategory: string;
  quantity: number;
  unitPrice: number;
  visitDate?: string;
}

interface TicketsConfirmationProps {
  customerName: string;
  items: TicketItem[];
  deliveryMethod: string;
  subtotal: number;
  shippingFee: number;
  surcharge: number;
  donation: number;
  total: number;
}

export default function TicketsConfirmation({
  customerName,
  items,
  deliveryMethod,
  subtotal,
  shippingFee,
  surcharge,
  donation,
  total,
}: TicketsConfirmationProps) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  // Group items by park
  const parkGroups = items.reduce<Record<string, TicketItem[]>>((acc, item) => {
    if (!acc[item.parkName]) acc[item.parkName] = [];
    acc[item.parkName].push(item);
    return acc;
  }, {});

  return (
    <Html>
      <Head />
      <Preview>Your Park Tickets Order Confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>YoM Orlando</Heading>
          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Park Tickets Confirmation
          </Heading>

          <Text style={text}>Dear {customerName},</Text>
          <Text style={text}>
            Thank you for your ticket order! Here is your complete breakdown:
          </Text>

          {Object.entries(parkGroups).map(([park, parkItems]) => (
            <Section key={park} style={section}>
              <Heading as="h3" style={h3}>
                {park}
              </Heading>
              {parkItems.map((item, i) => (
                <Text key={i} style={text}>
                  {item.optionLabel} — {item.ageCategory} x{item.quantity} @{" "}
                  {fmt(item.unitPrice)} = {fmt(item.unitPrice * item.quantity)}
                  {item.visitDate && ` (${item.visitDate})`}
                </Text>
              ))}
            </Section>
          ))}

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>Subtotal: {fmt(subtotal)}</Text>
            <Text style={text}>
              Delivery: {deliveryMethod}
              {shippingFee > 0 && ` — ${fmt(shippingFee)}`}
            </Text>
            {donation > 0 && (
              <Text style={text}>Donation: {fmt(donation)}</Text>
            )}
            {surcharge > 0 && (
              <Text style={text}>CC Surcharge (3%): {fmt(surcharge)}</Text>
            )}
          </Section>

          <Text style={totalStyle}>Total Charged: {fmt(total)}</Text>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h3" style={h3}>
              Important Reminders
            </Heading>
            <Text style={text}>
              - All ticket sales are final. No refunds or exchanges.
            </Text>
            <Text style={text}>
              - Fingerprint scanning is required at park entry. The original
              ticket holder must be present.
            </Text>
            <Text style={text}>
              - Tickets are non-transferable.
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Questions? Contact us at info@yomorlando.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "560px" };
const h1 = { color: "#2563eb", fontSize: "28px", textAlign: "center" as const };
const h2 = { color: "#1e293b", fontSize: "20px" };
const h3 = { color: "#1e293b", fontSize: "16px", marginBottom: "4px" };
const hr = { borderColor: "#e2e8f0", margin: "20px 0" };
const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };
const section = { marginBottom: "16px" };
const totalStyle = { color: "#1e293b", fontSize: "18px", fontWeight: "bold" };
const footer = { color: "#94a3b8", fontSize: "12px", textAlign: "center" as const };
