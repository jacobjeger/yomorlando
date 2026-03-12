import type { TicketOption } from "@/lib/database.types";
import type { TicketSelection } from "@/lib/validations/tickets";
import type { DeliveryOption } from "@/lib/settings-defaults";
import { DEFAULT_SETTINGS } from "@/lib/settings-defaults";

export function calculateTicketsTotal(params: {
  selections: Record<string, TicketSelection>;
  optionsMap: Record<string, TicketOption>;
  deliveryMethod: string;
  donationDollars: number;
  addSurcharge: boolean;
  deliveryOptions?: DeliveryOption[];
  surchargeRate?: number;
}) {
  const {
    selections,
    optionsMap,
    deliveryMethod,
    donationDollars,
    addSurcharge,
    deliveryOptions = DEFAULT_SETTINGS.ticket_delivery_options as unknown as DeliveryOption[],
    surchargeRate = 0.03,
  } = params;

  let ticketsSubtotal = 0;

  for (const [optionId, selection] of Object.entries(selections)) {
    const option = optionsMap[optionId];
    if (!option) continue;

    ticketsSubtotal += selection.childQty * option.price_child;
    ticketsSubtotal += selection.adultQty * option.price_adult;
  }

  const deliveryOption = deliveryOptions.find(
    (d) => d.value === deliveryMethod
  );
  const shippingFee = deliveryOption?.fee ?? 0;
  const donationCents = Math.round(donationDollars * 100);

  const subtotal = ticketsSubtotal + shippingFee;
  const beforeSurcharge = subtotal + donationCents;
  const surcharge = addSurcharge ? Math.round(beforeSurcharge * surchargeRate) : 0;
  const total = beforeSurcharge + surcharge;

  return {
    ticketsSubtotal,
    shippingFee,
    subtotal,
    donation: donationCents,
    surcharge,
    total,
  };
}
