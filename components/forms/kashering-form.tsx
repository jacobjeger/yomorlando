"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AlertTriangle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AddressBlock } from "@/components/forms/address-block";
import { SurchargeRadio } from "@/components/forms/surcharge-radio";
import { DonationInput } from "@/components/forms/donation-input";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { PriceDisplay } from "@/components/ui/price-display";
import { StripeProvider } from "@/components/stripe/stripe-provider";
import { PaymentForm } from "@/components/stripe/payment-form";
import { kasheringFormSchema, DEVELOPMENTS, type KasheringFormValues } from "@/lib/validations/kashering";
import { calculateKasheringTotal } from "@/lib/pricing/kashering";
import { createPaymentIntent } from "@/app/actions/payments";
import { submitKasheringOrder } from "@/app/actions/kashering";
import { useToast } from "@/hooks/use-toast";
import type { KasheringPricing } from "@/lib/settings-defaults";
import { PromoCodeInput } from "@/components/forms/promo-code-input";

interface KasheringFormProps {
  eventId: string;
  eventStartDate: string;
  eventEndDate: string;
  developments?: string[];
  kasheringPricing?: KasheringPricing;
  surchargeRate?: number;
}

export function KasheringForm({ eventId, eventStartDate, eventEndDate, developments, kasheringPricing, surchargeRate }: KasheringFormProps) {
  const devOptions = developments ?? [...DEVELOPMENTS];
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ promoId: string; code: string; discountAmount: number } | null>(null);
  const { toast } = useToast();

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(kasheringFormSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      billingAddress: { line1: "", line2: "", city: "", state: "", zip: "" },
      development: "",
      developmentOther: "",
      accessDay: "",
      numBedrooms: 1,
      numHouses: 1,
      shulMembership: false,
      ringSetQty: 0,
      counterRollQty: 0,
      donation: 0,
      addSurcharge: "no",
    },
  });

  const watched = form.watch();

  const pricing = calculateKasheringTotal({
    numHouses: watched.numHouses || 0,
    development: watched.development || "",
    shulMembership: watched.shulMembership || false,
    ringSetQty: watched.ringSetQty || 0,
    counterRollQty: watched.counterRollQty || 0,
    donationDollars: watched.donation || 0,
    addSurcharge: watched.addSurcharge === "yes",
    pricing: kasheringPricing,
    surchargeRate,
  });

  const handleCreatePaymentIntent = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Please fix the errors above",
        variant: "destructive",
      });
      return;
    }

    const finalTotal = Math.max(0, pricing.total - (appliedPromo?.discountAmount ?? 0));
    if (finalTotal <= 0) return;

    setIsSubmitting(true);
    try {
      const { clientSecret: secret } = await createPaymentIntent(
        finalTotal,
        {
          order_type: "kashering",
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
      const values = form.getValues() as KasheringFormValues;
      await submitKasheringOrder({
        eventId,
        paymentIntentId,
        ...values,
        pricing,
      });
      setOrderComplete(true);
      toast({
        title: "Order placed successfully!",
        description: "Check your email for confirmation.",
      });
    } catch {
      toast({
        title: "Error saving order",
        description: "Your payment was processed. Please contact us.",
        variant: "destructive",
      });
    }
  };

  if (orderComplete) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-muted-foreground">
          Your kashering order has been placed. A confirmation email has been
          sent to {watched.email}.
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
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
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
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Billing Address */}
        <AddressBlock prefix="billingAddress" label="Billing Address" />

        <Separator />

        {/* Development */}
        <FormField
          control={form.control}
          name="development"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Development</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {devOptions.map((dev) => (
                    <div key={dev} className="flex items-center space-x-2">
                      <RadioGroupItem value={dev} id={`dev-${dev}`} />
                      <Label htmlFor={`dev-${dev}`} className="font-normal cursor-pointer">
                        {dev}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watched.development === "Other" && (
          <FormField
            control={form.control}
            name="developmentOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Development Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter development name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Villa Address */}
        {(watched.numHouses || 0) > 0 && (
          <>
            <Separator />
            <AddressBlock prefix="villaAddress" label="Pesach Villa Address" />
          </>
        )}

        <Separator />

        {/* Access Day */}
        <FormField
          control={form.control}
          name="accessDay"
          render={({ field }) => {
            const selected = field.value ? new Date(field.value + "T00:00:00") : undefined;
            return (
              <FormItem>
                <FormLabel>Access Day</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(selected!, "EEEE, MMMM d, yyyy")
                          : "Select access day"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selected}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      disabled={(date) =>
                        date < new Date(eventStartDate + "T00:00:00") ||
                        date > new Date(eventEndDate + "T00:00:00")
                      }
                      defaultMonth={new Date(eventStartDate + "T00:00:00")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Separator />

        {/* Number of Bedrooms */}
        <FormField
          control={form.control}
          name="numBedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bedrooms</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
              {(field.value ?? 0) >= 10 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    We will contact you to discuss final pricing for larger homes.
                  </AlertDescription>
                </Alert>
              )}
            </FormItem>
          )}
        />

        {/* Number of Houses */}
        <FormField
          control={form.control}
          name="numHouses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Houses</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Shul Membership */}
        <FormField
          control={form.control}
          name="shulMembership"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  I am signing up for Anshei Solara Shul Membership
                </FormLabel>
                {watched.development === "Solara" && (
                  <p className="text-xs text-muted-foreground">
                    ${((kasheringPricing?.solara_discount ?? 7500) / 100)} discount per house applied
                  </p>
                )}
              </div>
            </FormItem>
          )}
        />

        <Separator />

        {/* Add-ons */}
        <div className="space-y-4">
          <h3 className="font-semibold">Add-ons</h3>

          <FormField
            control={form.control}
            name="ringSetQty"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Metal Cooking Ring Sets (${((kasheringPricing?.ring_set_price ?? 6000) / 100)}/set)</FormLabel>
                  <QuantityStepper
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="counterRollQty"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Counter Cover Rolls (${((kasheringPricing?.counter_roll_price ?? 3500) / 100)}/roll)</FormLabel>
                  <QuantityStepper
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Donation & Surcharge */}
        <DonationInput />
        <SurchargeRadio />

        <Separator />

        <PromoCodeInput
          orderType="kashering"
          subtotal={pricing.subtotal}
          onApply={setAppliedPromo}
        />

        <Separator />

        {/* Order Total */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span>
              Kashering ({watched.numHouses || 0} house
              {(watched.numHouses || 0) !== 1 ? "s" : ""})
            </span>
            <PriceDisplay cents={pricing.kasheringBase} size="sm" />
          </div>
          {pricing.ringsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span>Ring Sets x{watched.ringSetQty}</span>
              <PriceDisplay cents={pricing.ringsTotal} size="sm" />
            </div>
          )}
          {pricing.rollsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span>Counter Rolls x{watched.counterRollQty}</span>
              <PriceDisplay cents={pricing.rollsTotal} size="sm" />
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
