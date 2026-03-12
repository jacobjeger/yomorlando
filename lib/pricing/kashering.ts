const BASE_PRICE_PER_HOUSE = 47500; // $475
const SOLARA_MEMBER_DISCOUNT = 7500; // $75
const RING_SET_PRICE = 6000; // $60
const COUNTER_ROLL_PRICE = 3500; // $35

export function calculateKasheringTotal(params: {
  numHouses: number;
  development: string;
  shulMembership: boolean;
  ringSetQty: number;
  counterRollQty: number;
  donationDollars: number;
  addSurcharge: boolean;
}) {
  const {
    numHouses,
    development,
    shulMembership,
    ringSetQty,
    counterRollQty,
    donationDollars,
    addSurcharge,
  } = params;

  let kasheringBase = BASE_PRICE_PER_HOUSE * numHouses;

  // Solara + shul membership discount
  if (development === "Solara" && shulMembership) {
    kasheringBase -= SOLARA_MEMBER_DISCOUNT * numHouses;
  }

  const ringsTotal = RING_SET_PRICE * ringSetQty;
  const rollsTotal = COUNTER_ROLL_PRICE * counterRollQty;
  const donationCents = Math.round(donationDollars * 100);

  const subtotal = kasheringBase + ringsTotal + rollsTotal;
  const beforeSurcharge = subtotal + donationCents;
  const surcharge = addSurcharge ? Math.round(beforeSurcharge * 0.03) : 0;
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
