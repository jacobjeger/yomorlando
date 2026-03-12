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

interface LettuceConfirmationProps {
  customerName: string;
  bags: number;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress?: string;
  development?: string;
  subtotal: number;
  surcharge: number;
  donation: number;
  total: number;
}

export default function LettuceConfirmation({
  customerName,
  bags,
  deliveryMethod,
  deliveryAddress,
  development,
  subtotal,
  surcharge,
  donation,
  total,
}: LettuceConfirmationProps) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  return (
    <Html>
      <Head />
      <Preview>Your Checked Lettuce Order Confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>YoM Orlando</Heading>
          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Checked Lettuce Confirmation
          </Heading>

          <Text style={text}>Dear {customerName},</Text>
          <Text style={text}>
            Thank you for your checked lettuce order!
          </Text>

          <Section style={section}>
            <Text style={label}>Number of Bags</Text>
            <Text style={value}>{bags}</Text>

            <Text style={label}>
              {deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
            </Text>
            <Text style={value}>
              {deliveryMethod === "pickup"
                ? "Pickup at Solara Resort"
                : `Delivery to ${development}${deliveryAddress ? ` — ${deliveryAddress}` : ""}`}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>
              Lettuce ({bags} bag{bags > 1 ? "s" : ""}) — {fmt(bags * 2500)}
            </Text>
            {deliveryMethod === "delivery" && (
              <Text style={text}>Delivery Fee — {fmt(3000)}</Text>
            )}
            {donation > 0 && (
              <Text style={text}>Donation — {fmt(donation)}</Text>
            )}
            {surcharge > 0 && (
              <Text style={text}>CC Surcharge (3%) — {fmt(surcharge)}</Text>
            )}
          </Section>

          <Hr style={hr} />
          <Text style={totalStyle}>Total Charged: {fmt(total)}</Text>

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
const hr = { borderColor: "#e2e8f0", margin: "20px 0" };
const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };
const label = { color: "#64748b", fontSize: "12px", marginBottom: "2px", textTransform: "uppercase" as const };
const value = { color: "#1e293b", fontSize: "14px", marginTop: "0" };
const section = { marginBottom: "16px" };
const totalStyle = { color: "#1e293b", fontSize: "18px", fontWeight: "bold" };
const footer = { color: "#94a3b8", fontSize: "12px", textAlign: "center" as const };
