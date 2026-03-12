"use server";

import { stripe } from "@/lib/stripe";

export async function createPaymentIntent(
  amount: number,
  metadata: Record<string, string>
) {
  if (amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}

export async function refundPayment(paymentIntentId: string) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });

  return { refundId: refund.id, status: refund.status };
}
