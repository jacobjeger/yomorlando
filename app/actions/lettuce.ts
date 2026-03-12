"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { sendLettuceConfirmation, sendAdminOrderNotification } from "@/app/actions/emails";
import { getSetting } from "@/lib/queries/settings";
import type { LettuceFormValues, WaitlistFormValues } from "@/lib/validations/lettuce";

interface LettuceOrderData extends LettuceFormValues {
  eventId: string;
  paymentIntentId: string;
  pricing: {
    bagsTotal: number;
    deliveryFee: number;
    subtotal: number;
    donation: number;
    surcharge: number;
    total: number;
  };
}

export async function submitLettuceOrder(data: LettuceOrderData) {
  const supabase = createServiceClient();
  const lettucePricing = await getSetting("lettuce_pricing");
  const customerName = `${data.firstName} ${data.lastName}`;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      event_id: data.eventId,
      order_type: "lettuce",
      customer_name: customerName,
      customer_email: data.email,
      customer_phone: data.phone,
      customer_address: data.deliveryMethod === "delivery" && data.deliveryAddress
        ? data.deliveryAddress
        : {},
      stripe_payment_intent_id: data.paymentIntentId,
      subtotal: data.pricing.subtotal,
      surcharge: data.pricing.surcharge,
      donation: data.pricing.donation,
      total: data.pricing.total,
      fulfillment_status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error("Failed to create order");
  }

  // Create order items
  const bagPrice = lettucePricing.price_per_bag;
  const deliveryFeeAmount = lettucePricing.delivery_fee;
  const items = [
    {
      order_id: order.id,
      item_type: "lettuce",
      description: `Checked Lettuce (${data.bags} bag${data.bags > 1 ? "s" : ""})`,
      quantity: data.bags,
      unit_price: bagPrice,
      subtotal: data.bags * bagPrice,
      delivery_method: data.deliveryMethod,
    },
  ];

  if (data.deliveryMethod === "delivery") {
    items.push({
      order_id: order.id,
      item_type: "delivery_fee",
      description: "Delivery Fee",
      quantity: 1,
      unit_price: deliveryFeeAmount,
      subtotal: deliveryFeeAmount,
      delivery_method: "delivery",
    });
  }

  await supabase.from("order_items").insert(items);

  // Send confirmation email
  try {
    const deliveryAddr = data.deliveryAddress
      ? `${data.deliveryAddress.line1}, ${data.deliveryAddress.city}, ${data.deliveryAddress.state} ${data.deliveryAddress.zip}`
      : undefined;

    await sendLettuceConfirmation({
      to: data.email,
      customerName,
      bags: data.bags,
      deliveryMethod: data.deliveryMethod,
      deliveryAddress: deliveryAddr,
      development: data.development || undefined,
      subtotal: data.pricing.subtotal,
      surcharge: data.pricing.surcharge,
      donation: data.pricing.donation,
      total: data.pricing.total,
    });
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError);
  }

  // Send admin notification
  try {
    await sendAdminOrderNotification({
      customerName,
      customerEmail: data.email,
      orderId: order.id,
      orderType: "lettuce",
      total: data.pricing.total,
    });
  } catch (notifyError) {
    console.error("Failed to send admin notification:", notifyError);
  }

  return { orderId: order.id };
}

export async function submitWaitlistEntry(data: WaitlistFormValues & { eventId: string }) {
  const supabase = createServiceClient();

  const { error } = await supabase.from("lettuce_waitlist").insert({
    event_id: data.eventId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    bags_requested: data.bagsRequested,
  });

  if (error) {
    throw new Error("Failed to join waitlist");
  }

  return { success: true };
}
