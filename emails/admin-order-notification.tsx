import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AdminOrderNotificationProps {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderType: string;
  total: number;
}

const orderTypeLabels: Record<string, string> = {
  tickets: "Park Tickets",
  kashering: "Kashering",
  lettuce: "Checked Lettuce",
};

export default function AdminOrderNotification({
  customerName,
  customerEmail,
  orderId,
  orderType,
  total,
}: AdminOrderNotificationProps) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yomorlando.com";

  return (
    <Html>
      <Head />
      <Preview>New {orderTypeLabels[orderType] || orderType} order from {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>YoM Orlando — Admin</Heading>
          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            New Order Received
          </Heading>

          <Section style={section}>
            <Text style={text}><strong>Order Type:</strong> {orderTypeLabels[orderType] || orderType}</Text>
            <Text style={text}><strong>Customer:</strong> {customerName}</Text>
            <Text style={text}><strong>Email:</strong> {customerEmail}</Text>
            <Text style={text}><strong>Total:</strong> {fmt(total)}</Text>
            <Text style={text}><strong>Order ID:</strong> {orderId}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Link href={`${baseUrl}/admin/orders/${orderId}`} style={linkStyle}>
              View Order in Admin Portal →
            </Link>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            This is an automated notification from YoM Orlando.
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
const section = { marginBottom: "16px" };
const linkStyle = { color: "#2563eb", fontSize: "14px", fontWeight: "bold" as const };
const footer = { color: "#94a3b8", fontSize: "12px", textAlign: "center" as const };
