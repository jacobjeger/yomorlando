import { createServiceClient } from "@/lib/supabase/server";
import { OrderSummaryCard } from "@/components/order-summary-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import type { Order, OrderItem, KasheringDetails } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <div className="container max-w-2xl py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-muted-foreground mb-6">
          No order ID provided. If you just placed an order, check your email for confirmation details.
        </p>
        <Button asChild>
          <Link href="/order-lookup">Look Up Your Order</Link>
        </Button>
      </div>
    );
  }

  const supabase = createServiceClient();

  const [{ data: order }, { data: items }, { data: kasheringDetails }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", orderId).single(),
    supabase.from("order_items").select("*").eq("order_id", orderId),
    supabase.from("kashering_details").select("*").eq("order_id", orderId).single(),
  ]);

  if (!order) {
    return (
      <div className="container max-w-2xl py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find this order. Please check your confirmation email or look up your order.
        </p>
        <Button asChild>
          <Link href="/order-lookup">Look Up Your Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <OrderSummaryCard
        order={order as Order}
        items={(items ?? []) as OrderItem[]}
        kasheringDetails={kasheringDetails as KasheringDetails | null}
        showSuccessHeader
      />
      <div className="mt-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Save your order ID for future reference: <span className="font-mono text-xs">{orderId}</span>
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/order-lookup">Look Up Another Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
