"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { refundPayment } from "@/app/actions/payments";
import {
  sendKasheringConfirmation,
  sendLettuceConfirmation,
  sendTicketsConfirmation,
  sendOrderStatusUpdate,
} from "@/app/actions/emails";
import { revalidatePath } from "next/cache";
import type { FulfillmentStatus, Order, OrderItem, KasheringDetails, Address } from "@/lib/database.types";

export async function updateOrderStatus(orderId: string, status: FulfillmentStatus) {
  const supabase = createServiceClient();

  // Fetch order before updating so we have customer info for the email
  const { data: order } = await supabase
    .from("orders")
    .select("customer_email, customer_name, order_type, total")
    .eq("id", orderId)
    .single();

  const { error } = await supabase
    .from("orders")
    .update({ fulfillment_status: status })
    .eq("id", orderId);

  if (error) throw new Error("Failed to update order status");

  // Send status update email to customer
  if (order) {
    try {
      await sendOrderStatusUpdate({
        to: order.customer_email,
        customerName: order.customer_name,
        orderId,
        orderType: order.order_type,
        newStatus: status,
        total: order.total,
      });
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }
  }

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

export async function deleteOrder(orderId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("orders").delete().eq("id", orderId);
  if (error) throw new Error("Failed to delete order");
  revalidatePath("/admin/orders");
}

export async function resendConfirmationEmail(orderId: string) {
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) throw new Error("Order not found");

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  const typedOrder = order as Order;
  const typedItems = (items ?? []) as OrderItem[];

  if (typedOrder.order_type === "kashering") {
    const { data: kd } = await supabase
      .from("kashering_details")
      .select("*")
      .eq("order_id", orderId)
      .single();

    const details = kd as KasheringDetails;

    // Count ring sets and counter rolls from items
    const ringSetItem = typedItems.find((i) => i.item_type === "ring_set");
    const counterRollItem = typedItems.find((i) => i.item_type === "counter_roll");

    await sendKasheringConfirmation({
      to: typedOrder.customer_email,
      customerName: typedOrder.customer_name,
      villaAddress: details.villa_address,
      development: details.development,
      accessDay: details.access_day,
      numHouses: details.num_houses,
      numBedrooms: details.num_bedrooms,
      shulMembership: details.shul_membership,
      ringSetQty: ringSetItem?.quantity ?? 0,
      counterRollQty: counterRollItem?.quantity ?? 0,
      subtotal: typedOrder.subtotal,
      surcharge: typedOrder.surcharge,
      donation: typedOrder.donation,
      total: typedOrder.total,
    });
  } else if (typedOrder.order_type === "lettuce") {
    const lettuceItem = typedItems.find((i) => i.item_type === "lettuce");
    const deliveryMethod = lettuceItem?.delivery_method === "delivery" ? "delivery" : "pickup";

    await sendLettuceConfirmation({
      to: typedOrder.customer_email,
      customerName: typedOrder.customer_name,
      bags: lettuceItem?.quantity ?? 0,
      deliveryMethod,
      deliveryAddress:
        deliveryMethod === "delivery"
          ? `${(typedOrder.customer_address as Address).line1}, ${(typedOrder.customer_address as Address).city}, ${(typedOrder.customer_address as Address).state} ${(typedOrder.customer_address as Address).zip}`
          : undefined,
      development:
        deliveryMethod === "delivery"
          ? undefined
          : undefined,
      subtotal: typedOrder.subtotal,
      surcharge: typedOrder.surcharge,
      donation: typedOrder.donation,
      total: typedOrder.total,
    });
  } else if (typedOrder.order_type === "tickets") {
    const shippingItem = typedItems.find((i) => i.item_type === "shipping");
    const ticketItems = typedItems.filter((i) => i.item_type !== "shipping");

    await sendTicketsConfirmation({
      to: typedOrder.customer_email,
      customerName: typedOrder.customer_name,
      items: ticketItems.map((item) => ({
        parkName: item.description.split(" — ")[0] || item.description,
        optionLabel: item.description.split(" — ")[1] || item.description,
        ageCategory: item.age_category ?? "adult",
        quantity: item.quantity,
        unitPrice: item.unit_price,
        visitDate: item.visit_date ?? undefined,
      })),
      deliveryMethod: ticketItems[0]?.delivery_method ?? "pickup",
      subtotal: typedOrder.subtotal,
      shippingFee: shippingItem?.subtotal ?? 0,
      surcharge: typedOrder.surcharge,
      donation: typedOrder.donation,
      total: typedOrder.total,
    });
  } else {
    throw new Error(`Cannot resend email for order type: ${typedOrder.order_type}`);
  }
}
