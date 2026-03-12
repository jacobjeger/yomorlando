import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yomorlando.com"),
  title: {
    default: "YoM Orlando — Yom Tov Services by Yeshiva of Miami",
    template: "%s | YoM Orlando",
  },
  description:
    "Your source for Yom Tov services in the Orlando, Florida villa resort area. Discounted park tickets, villa kashering l'Pesach, checked lettuce, and more.",
  openGraph: {
    title: "YoM Orlando — Yom Tov Services by Yeshiva of Miami",
    description:
      "Discounted park tickets, villa kashering, checked lettuce, and more for the frum community in Orlando.",
    siteName: "YoM Orlando",
    locale: "en_US",
    type: "website",
    images: [{ url: "/logo-large.png", width: 280, height: 138, alt: "YoM Orlando" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "YoM Orlando — Yom Tov Services by Yeshiva of Miami",
    description:
      "Discounted park tickets, villa kashering, checked lettuce, and more for the frum community in Orlando.",
    images: ["/logo-large.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
