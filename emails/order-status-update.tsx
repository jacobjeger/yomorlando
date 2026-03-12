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

interface OrderStatusUpdateProps {
  customerName: string;
  orderId: string;
  orderType: string;
  newStatus: string;
  total: number;
}

const statusMessages: Record<string, string> = {
  fulfilled: "Your order has been fulfilled and is ready.",
  shipped: "Your order has been shipped! You should receive it soon.",
  picked_up: "Your order has been marked as picked up. Thank you!",
  pending: "Your order status has been updated to pending.",
};

const orderTypeLabels: Record<string, string> = {
  tickets: "Park Tickets",
  kashering: "Kashering",
  lettuce: "Checked Lettuce",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
  picked_up: "Picked Up",
};

export default function OrderStatusUpdate({
  customerName,
  orderId,
  orderType,
  newStatus,
  total,
}: OrderStatusUpdateProps) {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yomorlando.com";

  return (
    <Html>
      <Head />
      <Preview>Your YoM Orlando order has been {statusLabels[newStatus] || newStatus}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>YoM Orlando</Heading>
          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            Order Status Update
          </Heading>

          <Text style={text}>Dear {customerName},</Text>
          <Text style={text}>
            {statusMessages[newStatus] || `Your order status has been updated to: ${statusLabels[newStatus] || newStatus}.`}
          </Text>

          <Section style={section}>
            <Text style={text}><strong>Order Type:</strong> {orderTypeLabels[orderType] || orderType}</Text>
            <Text style={text}><strong>Status:</strong> {statusLabels[newStatus] || newStatus}</Text>
            <Text style={text}><strong>Total:</strong> {fmt(total)}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>
              You can view your full order details anytime:
            </Text>
            <Link href={`${baseUrl}/order-lookup`} style={linkStyle}>
              Look Up Your Order →
            </Link>
            <Text style={smallText}>
              Order ID: {orderId}
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
const hr = { borderColor: "#e2e8f0", margin: "20px 0" };
const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };
const section = { marginBottom: "16px" };
const linkStyle = { color: "#2563eb", fontSize: "14px", fontWeight: "bold" as const };
const smallText = { color: "#94a3b8", fontSize: "12px", fontFamily: "monospace" };
const footer = { color: "#94a3b8", fontSize: "12px", textAlign: "center" as const };
