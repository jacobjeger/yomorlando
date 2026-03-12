"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { refundPayment } from "@/app/actions/payments";
import { revalidatePath } from "next/cache";
import type { FulfillmentStatus } from "@/lib/database.types";

export async function updateOrderStatus(orderId: string, status: FulfillmentStatus) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({ fulfillment_status: status })
    .eq("id", orderId);

  if (error) throw new Error("Failed to update order status");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function refundOrder(orderId: string) {
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("stripe_payment_intent_id")
    .eq("id", orderId)
    .single();

  if (!order?.stripe_payment_intent_id) {
    throw new Error("No payment intent found for this order");
  }

  const result = await refundPayment(order.stripe_payment_intent_id);

  // Update order status
  await supabase
    .from("orders")
    .update({ fulfillment_status: "fulfilled" })
    .eq("id", orderId);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return result;
}
