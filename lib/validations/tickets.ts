import { z } from "zod";
import { internationalAddressSchema } from "./common";

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
  { value: "ship_3day", label: "Ship \u2014 3 day ($25)", fee: 2500 },
  { value: "ship_overnight", label: "Ship \u2014 Overnight ($35)", fee: 3500 },
  { value: "pickup", label: "Pickup", fee: 0 },
] as const;

export const ticketSelectionSchema = z.object({
  optionId: z.string(),
  childQty: z.coerce.number().int().min(0).default(0),
  adultQty: z.coerce.number().int().min(0).default(0),
  visitDate: z.string().default(""),
});

export const ticketsFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  address: internationalAddressSchema,
  weeksInOrlando: z.array(z.string()).default([]),
  comments: z.string().default(""),
  howHeard: z.string().default(""),
  howHeardOther: z.string().default(""),
  ticketSelections: z.record(z.string(), ticketSelectionSchema).default({}),
  universalDateRange: z.string().default(""),
  disneyFirstDay: z.string().default(""),
  seaworldDates: z.array(z.string()).default([]),
  deliveryMethod: z.string().default(""),
  pickupLocationId: z.string().default(""),
  agreedToTerms: z.boolean().default(false),
  donation: z.coerce.number().min(0).default(0),
  addSurcharge: z.enum(["yes", "no"]).default("no"),
});

export type TicketsFormValues = z.infer<typeof ticketsFormSchema>;
export type TicketSelection = z.infer<typeof ticketSelectionSchema>;
