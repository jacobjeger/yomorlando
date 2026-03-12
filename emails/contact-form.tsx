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

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactFormEmail({
  name,
  email,
  subject,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Contact form: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>YoM Orlando — Contact Form</Heading>
          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}><strong>From:</strong> {name} ({email})</Text>
            <Text style={text}><strong>Subject:</strong> {subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h3" style={h3}>Message</Heading>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Reply directly to this email to respond to {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const container = { margin: "0 auto", padding: "40px 20px", maxWidth: "560px" };
const h1 = { color: "#2563eb", fontSize: "28px", textAlign: "center" as const };
const h3 = { color: "#1e293b", fontSize: "16px", marginBottom: "4px" };
const hr = { borderColor: "#e2e8f0", margin: "20px 0" };
const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };
const section = { marginBottom: "16px" };
const messageStyle = { color: "#334155", fontSize: "14px", lineHeight: "24px", whiteSpace: "pre-wrap" as const };
const footer = { color: "#94a3b8", fontSize: "12px", textAlign: "center" as const };
