"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { waitlistFormSchema, type WaitlistFormValues } from "@/lib/validations/lettuce";
import { submitWaitlistEntry } from "@/app/actions/lettuce";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LettuceWaitlistFormProps {
  eventId: string;
}

export function LettuceWaitlistForm({ eventId }: LettuceWaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(waitlistFormSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bagsRequested: 1,
    },
  });

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const values = form.getValues() as WaitlistFormValues;
      await submitWaitlistEntry({ eventId, ...values });
      setSubmitted(true);
      toast({ title: "You have been added to the waitlist!" });
    } catch {
      toast({
        title: "Error joining waitlist",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Added to Waitlist</h2>
        <p className="text-muted-foreground">
          We&apos;ll notify you by email if more bags become available.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
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
          name="bagsRequested"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bags Requested</FormLabel>
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

        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...</>
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </form>
    </Form>
  );
}
