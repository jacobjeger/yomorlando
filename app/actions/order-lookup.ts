"use server";

import { createServiceClient } from "@/lib/supabase/server";
import type { Order, OrderItem, KasheringDetails } from "@/lib/database.types";

export async function lookupOrder(email: string, orderId: string) {
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId.trim())
    .eq("customer_email", email.trim().toLowerCase())
    .single();

  if (!order) {
    return { found: false as const, error: "No order found with that email and order ID combination." };
  }

  const [{ data: items }, { data: kasheringDetails }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", order.id),
    supabase.from("kashering_details").select("*").eq("order_id", order.id).single(),
  ]);

  return {
    found: true as const,
    order: order as Order,
    items: (items ?? []) as OrderItem[],
    kasheringDetails: kasheringDetails as KasheringDetails | null,
  };
}
