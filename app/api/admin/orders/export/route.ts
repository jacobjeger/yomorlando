import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { Order } from "@/lib/database.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = createServiceClient();

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orderType = searchParams.get("order_type");
  const status = searchParams.get("status");

  if (orderType && orderType !== "all") query = query.eq("order_type", orderType);
  if (status && status !== "all") query = query.eq("fulfillment_status", status);

  const { data } = await query;
  const orders = (data ?? []) as Order[];

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Order Type",
    "Total",
    "Stripe ID",
    "Status",
    "Created At",
  ];

  const rows = orders.map((order) => [
    `"${order.customer_name}"`,
    `"${order.customer_email}"`,
    `"${order.customer_phone}"`,
    order.order_type,
    (order.total / 100).toFixed(2),
    order.stripe_payment_intent_id || "",
    order.fulfillment_status,
    order.created_at,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
