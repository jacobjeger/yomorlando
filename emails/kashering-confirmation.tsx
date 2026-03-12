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
import type { Address } from "@/lib/database.types";

interface KasheringConfirmationProps {
  customerName: string;
  villaAddress: Address;
  development: string;
  accessDay: string;
  numHouses: number;
  numBedrooms: number;
  shulMembership: boolean;
  ringSetQty: number;
  counterRollQty: number;
  subtotal: number;
  surcharge: number;
  donation: number;
  total: number;
}

export default function KasheringConfirmation({
  customerName,
  villaAddress,
  development,
  accessDay,
  numHouses,
  numBedrooms,
  shulMembership,
  ringSetQty,
  counterRollQty,
  subtotal,
  surcharge,
  donation,
  total,
}: KasheringConfirmationProps) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  return (
    <Html>
      <Head />
      <Preview>Your Villa Kashering Order Confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>YoM Orlando</Heading>
          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Villa Kashering Confirmation
          </Heading>

          <Text style={text}>Dear {customerName},</Text>
          <Text style={text}>
            Thank you for your kashering order! Here are your order details:
          </Text>

          <Section style={section}>
            <Text style={label}>Development</Text>
            <Text style={value}>{development}</Text>

            <Text style={label}>Villa Address</Text>
            <Text style={value}>
              {villaAddress.line1}
              {villaAddress.line2 && `, ${villaAddress.line2}`},{" "}
              {villaAddress.city}, {villaAddress.state} {villaAddress.zip}
            </Text>

            <Text style={label}>Access Day</Text>
            <Text style={value}>{accessDay}</Text>

            <Text style={label}>Number of Houses</Text>
            <Text style={value}>{numHouses}</Text>

            <Text style={label}>Number of Bedrooms</Text>
            <Text style={value}>{numBedrooms}</Text>

            {shulMembership && (
              <>
                <Text style={label}>Shul Membership</Text>
                <Text style={value}>Anshei Solara — Applied discount</Text>
              </>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h3" style={h3}>
              Items Ordered
            </Heading>
            <Text style={text}>
              Kashering ({numHouses} house{numHouses > 1 ? "s" : ""})
            </Text>
            {ringSetQty > 0 && (
              <Text style={text}>
                Metal Cooking Ring Sets x{ringSetQty} — {fmt(ringSetQty * 6000)}
              </Text>
            )}
            {counterRollQty > 0 && (
              <Text style={text}>
                Counter Cover Rolls x{counterRollQty} — {fmt(counterRollQty * 3500)}
              </Text>
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

          {(ringSetQty > 0 || counterRollQty > 0) && (
            <Section style={section}>
              <Text style={label}>Pickup Instructions</Text>
              <Text style={text}>
                Ring sets and counter cover rolls can be picked up at the Solara
                Resort. Details will be sent closer to the holiday.
              </Text>
            </Section>
          )}

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
const h3 = { color: "#1e293b", fontSize: "16px" };
const hr = { borderColor: "#e2e8f0", margin: "20px 0" };
const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };
const label = { color: "#64748b", fontSize: "12px", marginBottom: "2px", textTransform: "uppercase" as const };
const value = { color: "#1e293b", fontSize: "14px", marginTop: "0" };
const section = { marginBottom: "16px" };
const totalStyle = { color: "#1e293b", fontSize: "18px", fontWeight: "bold" };
const footer = { color: "#94a3b8", fontSize: "12px", textAlign: "center" as const };
