import { z } from "zod";
import { internationalAddressSchema, nameSchema, contactSchema } from "./common";

export const HOW_HEARD_OPTIONS = [
  "Community WhatsApp chats",
  "CHAVI CHASE",
  "SY Classifieds",
  "Yeshiva World News",
  "School Flyer Handouts",
  "MKY Status",
  "My Jewish Florida",
  "Between Carpools",
  "Mommy Deals",
  "Jewish Echo",
  "Word of Mouth",
  "Other",
] as const;

export const DELIVERY_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp (Disney only, free)", fee: 0 },
  { value: "ship_3day", label: "Ship — 3 day ($25)", fee: 2500 },
  { value: "ship_overnight", label: "Ship — Overnight ($35)", fee: 3500 },
  { value: "pickup", label: "Pickup", fee: 0 },
] as const;

// Individual ticket selection per option
export const ticketSelectionSchema = z.object({
  optionId: z.string(),
  childQty: z.number().int().min(0).default(0),
  adultQty: z.number().int().min(0).default(0),
  visitDate: z.string().optional(),
});

export const ticketsFormSchema = z
  .object({
    ...nameSchema.shape,
    ...contactSchema.shape,
    address: internationalAddressSchema,
    weeksInOrlando: z.array(z.string()).min(1, "Select at least one week"),
    comments: z.string().optional().default(""),
    howHeard: z.string().min(1, "Please tell us how you heard about us"),
    howHeardOther: z.string().optional(),
    // Dynamic ticket selections keyed by option ID
    ticketSelections: z.record(
      z.string(),
      ticketSelectionSchema
    ),
    // Park-specific date selections
    universalDateRange: z.string().optional(),
    disneyFirstDay: z.string().optional(),
    seaworldDates: z.array(z.string()).optional(),
    // Delivery
    deliveryMethod: z.string().min(1, "Delivery method is required"),
    pickupLocationId: z.string().optional(),
    // Terms
    agreedToTerms: z.literal(true, {
      error: "You must agree to the terms",
    }),
    donation: z.number().min(0).default(0),
    addSurcharge: z.enum(["yes", "no"]).default("no"),
  })
  .refine(
    (data) => {
      if (data.howHeard === "Other") {
        return !!data.howHeardOther && data.howHeardOther.length > 0;
      }
      return true;
    },
    {
      message: "Please specify how you heard about us",
      path: ["howHeardOther"],
    }
  )
  .refine(
    (data) => {
      if (data.deliveryMethod === "pickup") {
        return !!data.pickupLocationId;
      }
      return true;
    },
    {
      message: "Please select a pickup location",
      path: ["pickupLocationId"],
    }
  );

export type TicketsFormValues = z.infer<typeof ticketsFormSchema>;
export type TicketSelection = z.infer<typeof ticketSelectionSchema>;
