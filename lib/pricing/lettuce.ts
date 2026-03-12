import type { LettucePricing } from "@/lib/settings-defaults";

const DEFAULTS: LettucePricing = {
  price_per_bag: 2500,
  delivery_fee: 3000,
};

export function calculateLettuceTotal(params: {
  bags: number;
  isDelivery: boolean;
  donationDollars: number;
  addSurcharge: boolean;
  pricing?: LettucePricing;
  surchargeRate?: number;
}) {
  const {
    bags,
    isDelivery,
    donationDollars,
    addSurcharge,
    pricing = DEFAULTS,
    surchargeRate = 0.03,
  } = params;

  const bagsTotal = pricing.price_per_bag * bags;
  const deliveryFee = isDelivery ? pricing.delivery_fee : 0;
  const donationCents = Math.round(donationDollars * 100);

  const subtotal = bagsTotal + deliveryFee;
  const beforeSurcharge = subtotal + donationCents;
  const surcharge = addSurcharge ? Math.round(beforeSurcharge * surchargeRate) : 0;
  const total = beforeSurcharge + surcharge;

  return {
    bagsTotal,
    deliveryFee,
    subtotal,
    donation: donationCents,
    surcharge,
    total,
  };
}
