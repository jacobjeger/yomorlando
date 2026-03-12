"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => Promise<void>;
  totalCents: number;
  disabled?: boolean;
}

export function PaymentForm({
  onSuccess,
  totalCents,
  disabled = false,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

    if (stripeError) {
      setError(stripeError.message || "An error occurred processing your payment.");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      await onSuccess(paymentIntent.id);
    }

    setIsProcessing(false);
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || isProcessing || disabled || totalCents <= 0}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(totalCents / 100)}`
        )}
      </Button>
    </div>
  );
}
