"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddressBlock } from "@/components/forms/address-block";
import { SurchargeRadio } from "@/components/forms/surcharge-radio";
import { DonationInput } from "@/components/forms/donation-input";
import { PriceDisplay } from "@/components/ui/price-display";
import { StripeProvider } from "@/components/stripe/stripe-provider";
import { PaymentForm } from "@/components/stripe/payment-form";
import { UniversalSection } from "@/components/forms/park-sections/universal-section";
import { SeaworldSection } from "@/components/forms/park-sections/seaworld-section";
import { DisneySection } from "@/components/forms/park-sections/disney-section";
import { GenericParkSection } from "@/components/forms/park-sections/generic-park-section";
import { ticketsFormSchema, HOW_HEARD_OPTIONS, DELIVERY_OPTIONS, type TicketsFormValues } from "@/lib/validations/tickets";
import { calculateTicketsTotal } from "@/lib/pricing/tickets";
import { createPaymentIntent } from "@/app/actions/payments";
import { submitTicketOrder } from "@/app/actions/tickets";
import { useToast } from "@/hooks/use-toast";
import type { EventWithParks, TicketOption } from "@/lib/database.types";
import type { DeliveryOption } from "@/lib/settings-defaults";

interface TicketsFormProps {
  event: EventWithParks;
  howHeardOptions?: string[];
  deliveryOptions?: DeliveryOption[];
  surchargeRate?: number;
}

const PARK_LABELS: Record<string, string> = {
  universal: "Universal Orlando",
  seaworld: "SeaWorld Orlando",
  disney: "Walt Disney World",
  other: "Other Parks",
};

export function TicketsForm({ event, howHeardOptions, deliveryOptions, surchargeRate }: TicketsFormProps) {
  const howHeardOpts = howHeardOptions ?? [...HOW_HEARD_OPTIONS];
  const deliveryOpts: DeliveryOption[] = deliveryOptions ?? (DELIVERY_OPTIONS as unknown as DeliveryOption[]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ticketsFormSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: { line1: "", line2: "", city: "", state: "", zip: "", country: "US" },
      weeksInOrlando: [] as string[],
      comments: "",
      howHeard: "",
      howHeardOther: "",
      ticketSelections: {} as Record<string, { optionId: string; childQty: number; adultQty: number; visitDate: string }>,
      universalDateRange: "",
      disneyFirstDay: "",
      seaworldDates: [] as string[],
      deliveryMethod: "",
      pickupLocationId: "",
      agreedToTerms: false,
      donation: 0,
      addSurcharge: "no" as "yes" | "no",
    },
  });

  const watched = form.watch();

  // Build options map for pricing
  const optionsMap = useMemo(() => {
    const map: Record<string, TicketOption> = {};
    for (const park of event.parks) {
      for (const opt of park.ticket_options) {
        map[opt.id] = opt;
      }
    }
    return map;
  }, [event.parks]);

  // Collect all date range labels for "weeks in Orlando" checkboxes
  const allDateRanges = useMemo(() => {
    const ranges: { id: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const park of event.parks) {
      for (const range of park.event_date_ranges) {
        if (!seen.has(range.label)) {
          seen.add(range.label);
          ranges.push({ id: range.id, label: range.label });
        }
      }
    }
    return ranges;
  }, [event.parks]);

  const pricing = calculateTicketsTotal({
    selections: watched.ticketSelections || {},
    optionsMap,
    deliveryMethod: String(watched.deliveryMethod),
    donationDollars: watched.donation || 0,
    addSurcharge: String(watched.addSurcharge) === "yes",
    deliveryOptions: deliveryOpts,
    surchargeRate,
  });

  const handleCreatePaymentIntent = useCallback(async () => {
    // Basic validation
    if (!watched.firstName || !watched.lastName || !watched.email || !watched.phone) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!watched.deliveryMethod) {
      toast({ title: "Please select a delivery method", variant: "destructive" });
      return;
    }
    if (!watched.agreedToTerms) {
      toast({ title: "You must agree to the terms", variant: "destructive" });
      return;
    }
    if (pricing.total <= 0) {
      toast({ title: "Please select at least one ticket", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { clientSecret: secret } = await createPaymentIntent(
        pricing.total,
        {
          order_type: "tickets",
          event_id: event.id,
          customer_email: watched.email,
        }
      );
      setClientSecret(secret);
    } catch {
      toast({ title: "Error creating payment", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [watched, pricing.total, event.id, toast]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const values = form.getValues() as TicketsFormValues;
      await submitTicketOrder({
        eventId: event.id,
        paymentIntentId,
        ...values,
        pricing,
        optionsMap,
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
          Your ticket order has been placed. A confirmation email has been sent
          to {watched.email}.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <AddressBlock prefix="address" label="Address" includeCountry />

        <Separator />

        {/* Weeks in Orlando */}
        {allDateRanges.length > 0 && (
          <FormField
            control={form.control}
            name="weeksInOrlando"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which week(s) will you be in Orlando?</FormLabel>
                <div className="space-y-2">
                  {allDateRanges.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={(field.value as string[])?.includes(range.label)}
                        onCheckedChange={(checked) => {
                          const current = (field.value as string[]) || [];
                          field.onChange(
                            checked
                              ? [...current, range.label]
                              : current.filter((v: string) => v !== range.label)
                          );
                        }}
                      />
                      <Label className="font-normal">{range.label}</Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField control={form.control} name="comments" render={({ field }) => (
          <FormItem><FormLabel>Comments (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField
          control={form.control}
          name="howHeard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you hear about us?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value as string}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {howHeardOpts.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {String(watched.howHeard) === "Other" && (
          <FormField control={form.control} name="howHeardOther" render={({ field }) => (
            <FormItem><FormLabel>Please specify</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        )}

        <Separator />

        {/* Park Sections */}
        <h2 className="text-xl font-bold">Select Your Tickets</h2>

        <Accordion type="multiple" className="w-full">
          {event.parks.map((park) => (
            <AccordionItem key={park.id} value={park.id}>
              <AccordionTrigger className="text-lg">
                {PARK_LABELS[park.park_name] || park.park_name}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {park.park_name === "universal" && (
                  <UniversalSection park={park} form={form} />
                )}
                {park.park_name === "seaworld" && (
                  <SeaworldSection park={park} form={form} />
                )}
                {park.park_name === "disney" && (
                  <DisneySection park={park} form={form} />
                )}
                {park.park_name === "other" && (
                  <GenericParkSection park={park} form={form} />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Separator />

        {/* Delivery */}
        <FormField
          control={form.control}
          name="deliveryMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Delivery</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value as string} className="space-y-2">
                  {deliveryOpts.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={`del-${opt.value}`} />
                      <Label htmlFor={`del-${opt.value}`} className="font-normal cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {String(watched.deliveryMethod) === "pickup" && event.pickup_locations.length > 0 && (
          <FormField
            control={form.control}
            name="pickupLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Location</FormLabel>
                <Select onValueChange={field.onChange} value={field.value as string}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {event.pickup_locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}{loc.address ? ` — ${loc.address}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Separator />

        {/* Disclaimer */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">Disclaimer</p>
          <p>All ticket sales are final. No refunds, exchanges, or cancellations.</p>
          <p>Fingerprint scanning is required at park entry. The original ticket holder must be present.</p>
          <p>Tickets are non-transferable.</p>
          <p>Prices are subject to change without notice.</p>
        </div>

        <FormField
          control={form.control}
          name="agreedToTerms"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">
                I have read and agree to all terms above
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <DonationInput />
        <SurchargeRadio />

        <Separator />

        {/* Order Total */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">Order Summary</h3>
          {pricing.ticketsSubtotal > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tickets Subtotal</span>
              <PriceDisplay cents={pricing.ticketsSubtotal} size="sm" />
            </div>
          )}
          {pricing.shippingFee > 0 && (
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <PriceDisplay cents={pricing.shippingFee} size="sm" />
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
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Grand Total</span>
            <PriceDisplay cents={pricing.total} size="lg" />
          </div>
        </div>

        {/* Payment */}
        {!clientSecret ? (
          <button
            type="button"
            onClick={handleCreatePaymentIntent}
            disabled={isSubmitting || pricing.total <= 0}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Preparing payment..." : "Proceed to Payment"}
          </button>
        ) : (
          <StripeProvider clientSecret={clientSecret}>
            <PaymentForm onSuccess={handlePaymentSuccess} totalCents={pricing.total} />
          </StripeProvider>
        )}
      </form>
    </Form>
  );
}
