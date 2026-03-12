import type { KasheringPricing } from "@/lib/settings-defaults";

const DEFAULTS: KasheringPricing = {
  base_price: 47500,
  solara_discount: 7500,
  ring_set_price: 6000,
  counter_roll_price: 3500,
};

export function calculateKasheringTotal(params: {
  numHouses: number;
  development: string;
  shulMembership: boolean;
  ringSetQty: number;
  counterRollQty: number;
  donationDollars: number;
  addSurcharge: boolean;
  pricing?: KasheringPricing;
  surchargeRate?: number;
}) {
  const {
    numHouses,
    development,
    shulMembership,
    ringSetQty,
    counterRollQty,
    donationDollars,
    addSurcharge,
    pricing = DEFAULTS,
    surchargeRate = 0.03,
  } = params;

  let kasheringBase = pricing.base_price * numHouses;

  // Solara + shul membership discount
  if (development === "Solara" && shulMembership) {
    kasheringBase -= pricing.solara_discount * numHouses;
  }

  const ringsTotal = pricing.ring_set_price * ringSetQty;
  const rollsTotal = pricing.counter_roll_price * counterRollQty;
  const donationCents = Math.round(donationDollars * 100);

  const subtotal = kasheringBase + ringsTotal + rollsTotal;
  const beforeSurcharge = subtotal + donationCents;
  const surcharge = addSurcharge ? Math.round(beforeSurcharge * surchargeRate) : 0;
  const total = beforeSurcharge + surcharge;

  return {
    kasheringBase,
    ringsTotal,
    rollsTotal,
    subtotal,
    donation: donationCents,
    surcharge,
    total,
  };
}
