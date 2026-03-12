"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressBlock } from "@/components/forms/address-block";
import { SurchargeRadio } from "@/components/forms/surcharge-radio";
import { DonationInput } from "@/components/forms/donation-input";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { PriceDisplay } from "@/components/ui/price-display";
import { StripeProvider } from "@/components/stripe/stripe-provider";
import { PaymentForm } from "@/components/stripe/payment-form";
import { lettuceFormSchema, DELIVERY_DEVELOPMENTS, type LettuceFormValues } from "@/lib/validations/lettuce";
import { calculateLettuceTotal } from "@/lib/pricing/lettuce";
import { createPaymentIntent } from "@/app/actions/payments";
import { submitLettuceOrder } from "@/app/actions/lettuce";
import { useToast } from "@/hooks/use-toast";
import type { LettucePricing } from "@/lib/settings-defaults";
import { PromoCodeInput } from "@/components/forms/promo-code-input";

interface LettuceFormProps {
  eventId: string;
  developments?: string[];
  lettucePricing?: LettucePricing;
  surchargeRate?: number;
}

export function LettuceForm({ eventId, developments, lettucePricing, surchargeRate }: LettuceFormProps) {
  const devOptions = developments ?? [...DELIVERY_DEVELOPMENTS];
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ promoId: string; code: string; discountAmount: number } | null>(null);
  const { toast } = useToast();

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(lettuceFormSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bags: 1,
      deliveryMethod: "pickup" as const,
      development: "",
      deliveryAddress: { line1: "", line2: "", city: "", state: "", zip: "" },
      donation: 0,
      addSurcharge: "no" as const,
    },
  });

  const watched = form.watch();

  const pricing = calculateLettuceTotal({
    bags: watched.bags || 1,
    isDelivery: String(watched.deliveryMethod) === "delivery",
    donationDollars: watched.donation || 0,
    addSurcharge: String(watched.addSurcharge) === "yes",
    pricing: lettucePricing,
    surchargeRate,
  });

  const handleCreatePaymentIntent = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({ title: "Please fix the errors above", variant: "destructive" });
      return;
    }

    const finalTotal = Math.max(0, pricing.total - (appliedPromo?.discountAmount ?? 0));
    if (finalTotal <= 0) return;

    setIsSubmitting(true);
    try {
      const { clientSecret: secret } = await createPaymentIntent(
        finalTotal,
        {
          order_type: "lettuce",
          event_id: eventId,
          customer_email: watched.email,
        }
      );
      setClientSecret(secret);
    } catch {
      toast({
        title: "Error creating payment",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, pricing.total, eventId, watched.email, toast, appliedPromo]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const values = form.getValues() as LettuceFormValues;
      const result = await submitLettuceOrder({
        eventId,
        paymentIntentId,
        ...values,
        pricing,
      });
      router.push(`/order-confirmation?orderId=${result.orderId}`);
    } catch {
      setOrderComplete(true);
      toast({
        title: "Error saving order",
        description: "Your payment was processed. Please contact us at info@yomorlando.com.",
        variant: "destructive",
      });
    }
  };

  if (orderComplete) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-muted-foreground">
          Your lettuce order has been placed. A confirmation email has been sent
          to {watched.email}.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input type="tel" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Bags */}
        <FormField
          control={form.control}
          name="bags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bags (${((lettucePricing?.price_per_bag ?? 2500) / 100)}/bag)</FormLabel>
              <FormControl>
                <QuantityStepper
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Delivery Method */}
        <FormField
          control={form.control}
          name="deliveryMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup or Delivery</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="font-normal cursor-pointer">
                      Pickup in Solara Resort — Free
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="font-normal cursor-pointer">
                      Delivery — ${((lettucePricing?.delivery_fee ?? 3000) / 100)} flat fee
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Delivery Details */}
        {String(watched.deliveryMethod) === "delivery" && (
          <>
            <FormField
              control={form.control}
              name="development"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Development</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select development" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {devOptions.map((dev) => (
                        <SelectItem key={dev} value={dev}>
                          {dev}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AddressBlock prefix="deliveryAddress" label="Delivery Address" />
          </>
        )}

        <Separator />

        <DonationInput />
        <SurchargeRadio />

        <Separator />

        <PromoCodeInput
          orderType="lettuce"
          subtotal={pricing.subtotal}
          onApply={setAppliedPromo}
        />

        <Separator />

        {/* Order Total */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span>Lettuce ({watched.bags || 1} bag{(watched.bags || 1) !== 1 ? "s" : ""})</span>
            <PriceDisplay cents={pricing.bagsTotal} size="sm" />
          </div>
          {pricing.deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <PriceDisplay cents={pricing.deliveryFee} size="sm" />
            </div>
          )}
          {pricing.donation > 0 && (
            <div className="flex justify-between text-sm">
              <span>Donation</span>
              <PriceDisplay cents={pricing.donation} size="sm" />
            </div>
          )}
          {pricing.surcharge > 0 && (
            <div className="flex justify-between text-sm">
              <span>CC Surcharge ({((surchargeRate ?? 0.03) * 100).toFixed(0)}%)</span>
              <PriceDisplay cents={pricing.surcharge} size="sm" />
            </div>
          )}
          {appliedPromo && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({appliedPromo.code})</span>
              <span>−${(appliedPromo.discountAmount / 100).toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <PriceDisplay cents={Math.max(0, pricing.total - (appliedPromo?.discountAmount ?? 0))} size="lg" />
          </div>
        </div>

        {/* Payment */}
        {!clientSecret ? (
          <button
            type="button"
            onClick={handleCreatePaymentIntent}
            disabled={isSubmitting || Math.max(0, pricing.total - (appliedPromo?.discountAmount ?? 0)) <= 0}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Preparing payment..." : "Proceed to Payment"}
          </button>
        ) : (
          <StripeProvider clientSecret={clientSecret}>
            <PaymentForm
              onSuccess={handlePaymentSuccess}
              totalCents={Math.max(0, pricing.total - (appliedPromo?.discountAmount ?? 0))}
            />
          </StripeProvider>
        )}
      </form>
    </Form>
  );
}
