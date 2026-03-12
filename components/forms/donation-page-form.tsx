"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripeProvider } from "@/components/stripe/stripe-provider";
import { PaymentForm } from "@/components/stripe/payment-form";
import { createPaymentIntent } from "@/app/actions/payments";
import { Heart, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [18, 36, 54, 100];

export function DonationPageForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const effectiveAmount = selectedAmount ?? (customAmount ? Number(customAmount) : 0);
  const amountCents = Math.round(effectiveAmount * 100);

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setClientSecret(null);
  };

  const handleCustomChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setClientSecret(null);
  };

  const handleProceedToPayment = async () => {
    if (amountCents < 100) return;
    setIsCreating(true);
    try {
      const { clientSecret: secret } = await createPaymentIntent(amountCents, {
        order_type: "donation",
      });
      setClientSecret(secret);
    } catch {
      // Payment intent creation failed
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuccess = async () => {
    setCompleted(true);
  };

  if (completed) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-10 pb-10 space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground">
            Your generous donation of{" "}
            <strong>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(effectiveAmount)}
            </strong>{" "}
            has been received. May you be blessed for your support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-[hsl(38,75%,55%)]" />
          Make a Donation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset amounts */}
        <div>
          <Label className="mb-2 block">Select an amount</Label>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={selectedAmount === amount ? "default" : "outline"}
                className={cn(
                  "h-12 text-lg font-semibold",
                  selectedAmount === amount &&
                    "bg-[hsl(224,50%,28%)] hover:bg-[hsl(224,50%,35%)]"
                )}
                onClick={() => handlePresetClick(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <Label htmlFor="custom-amount" className="mb-2 block">
            Or enter a custom amount
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="custom-amount"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              className="pl-7 h-12 text-lg"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
            />
          </div>
        </div>

        {/* Stripe payment or proceed button */}
        {clientSecret ? (
          <StripeProvider clientSecret={clientSecret}>
            <PaymentForm
              onSuccess={handleSuccess}
              totalCents={amountCents}
            />
          </StripeProvider>
        ) : (
          <Button
            className="w-full h-12 text-base"
            size="lg"
            disabled={amountCents < 100 || isCreating}
            onClick={handleProceedToPayment}
          >
            {isCreating
              ? "Preparing..."
              : amountCents < 100
                ? "Enter an amount"
                : `Donate ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(effectiveAmount)}`}
          </Button>
        )}

        <p className="text-xs text-center text-muted-foreground">
          All donations go directly to Yeshiva of Miami to support Yom Tov
          services in Orlando.
        </p>
      </CardContent>
    </Card>
  );
}
