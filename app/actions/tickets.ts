"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { sendTicketsConfirmation } from "@/app/actions/emails";
import type { TicketsFormValues } from "@/lib/validations/tickets";
import type { TicketOption } from "@/lib/database.types";

interface TicketOrderData extends TicketsFormValues {
  eventId: string;
  paymentIntentId: string;
  pricing: {
    ticketsSubtotal: number;
    shippingFee: number;
    subtotal: number;
    donation: number;
    surcharge: number;
    total: number;
  };
  optionsMap: Record<string, TicketOption>;
}

const PARK_LABELS: Record<string, string> = {
  universal: "Universal Orlando",
  seaworld: "SeaWorld Orlando",
  disney: "Walt Disney World",
  other: "Other Parks",
};

export async function submitTicketOrder(data: TicketOrderData) {
  const supabase = createServiceClient();
  const customerName = `${data.firstName} ${data.lastName}`;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      event_id: data.eventId,
      order_type: "tickets",
      customer_name: customerName,
      customer_email: data.email,
      customer_phone: data.phone,
      customer_address: data.address,
      stripe_payment_intent_id: data.paymentIntentId,
      subtotal: data.pricing.subtotal,
      surcharge: data.pricing.surcharge,
      donation: data.pricing.donation,
      total: data.pricing.total,
      fulfillment_status: "pending",
      how_heard: data.howHeard === "Other" ? data.howHeardOther : data.howHeard,
      comments: data.comments || null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error("Failed to create order");
  }

  // Create order items from ticket selections
  const items: Array<{
    order_id: string;
    ticket_option_id: string;
    item_type: string;
    description: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    age_category: string;
    visit_date: string | null;
    delivery_method: string;
  }> = [];

  const emailItems: Array<{
    parkName: string;
    optionLabel: string;
    ageCategory: string;
    quantity: number;
    unitPrice: number;
    visitDate?: string;
  }> = [];

  for (const [optionId, selection] of Object.entries(data.ticketSelections || {})) {
    const option = data.optionsMap[optionId];
    if (!option) continue;

    // Get park name for the option
    const { data: park } = await supabase
      .from("parks")
      .select("park_name")
      .eq("id", option.park_id)
      .single();
    const parkLabel = park ? PARK_LABELS[park.park_name] || park.park_name : "Unknown";

    if (selection.childQty > 0) {
      items.push({
        order_id: order.id,
        ticket_option_id: optionId,
        item_type: "ticket",
        description: `${parkLabel} — ${option.label} (Child)`,
        quantity: selection.childQty,
        unit_price: option.price_child,
        subtotal: selection.childQty * option.price_child,
        age_category: "child",
        visit_date: selection.visitDate || data.disneyFirstDay || null,
        delivery_method: data.deliveryMethod,
      });
      emailItems.push({
        parkName: parkLabel,
        optionLabel: option.label,
        ageCategory: "Child",
        quantity: selection.childQty,
        unitPrice: option.price_child,
        visitDate: selection.visitDate || data.disneyFirstDay || undefined,
      });
    }

    if (selection.adultQty > 0) {
      items.push({
        order_id: order.id,
        ticket_option_id: optionId,
        item_type: "ticket",
        description: `${parkLabel} — ${option.label} (Adult)`,
        quantity: selection.adultQty,
        unit_price: option.price_adult,
        subtotal: selection.adultQty * option.price_adult,
        age_category: "adult",
        visit_date: selection.visitDate || data.disneyFirstDay || null,
        delivery_method: data.deliveryMethod,
      });
      emailItems.push({
        parkName: parkLabel,
        optionLabel: option.label,
        ageCategory: "Adult",
        quantity: selection.adultQty,
        unitPrice: option.price_adult,
        visitDate: selection.visitDate || data.disneyFirstDay || undefined,
      });
    }
  }

  if (items.length > 0) {
    await supabase.from("order_items").insert(items);
  }

  // Determine delivery label
  const deliveryLabels: Record<string, string> = {
    whatsapp: "WhatsApp",
    ship_3day: "Ship — 3 day",
    ship_overnight: "Ship — Overnight",
    pickup: "Pickup",
  };

  // Send confirmation email
  try {
    await sendTicketsConfirmation({
      to: data.email,
      customerName,
      items: emailItems,
      deliveryMethod: deliveryLabels[data.deliveryMethod] || data.deliveryMethod,
      subtotal: data.pricing.subtotal,
      shippingFee: data.pricing.shippingFee,
      surcharge: data.pricing.surcharge,
      donation: data.pricing.donation,
      total: data.pricing.total,
    });
  } catch (emailError) {
    console.error("Failed to send confirmation email:", emailError);
  }

  return { orderId: order.id };
}
