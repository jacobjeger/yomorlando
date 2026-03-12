import type { Metadata } from "next";
import { OrderLookupForm } from "@/components/order-lookup-form";

export const metadata: Metadata = {
  title: "Order Lookup",
  description: "Look up your YoM Orlando order status.",
};

export default function OrderLookupPage() {
  return (
    <div className="container max-w-2xl py-12 md:py-16">
      <h1 className="text-3xl font-bold mb-2">Order Lookup</h1>
      <p className="text-muted-foreground mb-8">
        Enter your email address and order ID to view your order details and status.
      </p>
      <OrderLookupForm />
    </div>
  );
}
