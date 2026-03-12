"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { sendKasheringConfirmation } from "@/app/actions/emails";
import type { KasheringFormValues } from "@/lib/validations/kashering";

interface KasheringOrderData extends KasheringFormValues {
  eventId: string;
  paymentIntentId: string;
  pricing: {
    kasheringBase: number;
    ringsTotal: number;
    rollsTotal: number;
    subtotal: number;
    donation: number;
    surcharge: number;
    total: number;
  };
}

export async function submitKasheringOrder(data: KasheringOrderData) {
  const supabase = createServiceClient();

  const customerName = `${data.firstName} ${data.lastName}`;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      event_id: data.eventId,
      order_type: "kashering" as const,
      customer_name: customerName,
      customer_email: data.email,
      customer_phone: data.phone,
      customer_address: data.billingAddress,
      stripe_payment_intent_id: data.paymentIntentId,
      subtotal: data.pricing.subtotal,
      surcharge: data.pricing.surcharge,
      donation: data.pricing.donation,
      total: data.pricing.total,
      fulfillment_status: "pending" as const,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error("Failed to create order");
  }

  // Create kashering details
  const { error: detailsError } = await supabase
    .from("kashering_details")
    .insert({
      order_id: order.id,
      villa_address: data.villaAddress || data.billingAddress,
      development:
        data.development === "Other"
          ? data.developmentOther || "Other"
          : data.development,
      access_day: data.accessDay,
      num_bedrooms: data.numBedrooms,
      num_houses: data.numHouses,
      shul_membership: data.shulMembership,
    });

  if (detailsError) {
    throw new Error("Failed to save kashering details");
  }

  // Create order items
  const items = [];

  items.push({
    order_id: order.id,
    item_type: "kashering",
    description: `Villa Kashering (${data.numHouses} house${data.numHouses > 1 ? "s" : ""})`,
    quantity: data.numHouses,
    unit_price: data.pricing.kasheringBase / data.numHouses,
    subtotal: data.pricing.kasheringBase,
  });

  if (data.ringSetQty > 0) {
    items.push({
      order_id: order.id,
      item_type: "ring_set",
      description: "Metal Cooking Ring Sets",
      quantity: data.ringSetQty,
      unit_price: 6000,
      subtotal: data.ringSetQty * 6000,
    });
  }

  if (data.counterRollQty > 0) {
    items.push({
      order_id: order.id,
      item_type: "counter_roll",
      description: "Counter Cover Rolls",
      quantity: data.counterRollQty,
      unit_price: 3500,
      subtotal: data.counterRollQty * 3500,
    });
  }

  if (items.length > 0) {
    await supabase.from("order_items").insert(items);
  }

  // Send confirmation email
  try {
    await sendKasheringConfirmation({
      to: data.email,
      customerName,
      villaAddress: data.villaAddress || data.billingAddress,
      development:
        data.development === "Other"
          ? data.developmentOther || "Other"
          : data.development,
      accessDay: data.accessDay,
      numHouses: data.numHouses,
      numBedrooms: data.numBedrooms,
      shulMembership: data.shulMembership,
      ringSetQty: data.ringSetQty,
      counterRollQty: data.counterRollQty,
      subtotal: data.pricing.subtotal,
      surcharge: data.pricing.surcharge,
      donation: data.pricing.donation,
      total: data.pricing.total,
    });
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError);
  }

  return { orderId: order.id };
}
