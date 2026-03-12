const PRICE_PER_BAG = 2500; // $25
const DELIVERY_FEE = 3000; // $30

export function calculateLettuceTotal(params: {
  bags: number;
  isDelivery: boolean;
  donationDollars: number;
  addSurcharge: boolean;
}) {
  const { bags, isDelivery, donationDollars, addSurcharge } = params;

  const bagsTotal = PRICE_PER_BAG * bags;
  const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
  const donationCents = Math.round(donationDollars * 100);

  const subtotal = bagsTotal + deliveryFee;
  const beforeSurcharge = subtotal + donationCents;
  const surcharge = addSurcharge ? Math.round(beforeSurcharge * 0.03) : 0;
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
