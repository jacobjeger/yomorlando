import { z } from "zod";
import { addressSchema } from "./common";

export const DELIVERY_DEVELOPMENTS = [
  "Solara",
  "Solterra",
  "Villatel Village",
  "Champions Gate",
  "Reunion/Bears Den",
  "Encore",
  "Storey Lake",
  "Windsor Island",
  "Eden Gardens",
] as const;

export const lettuceFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  bags: z.coerce.number().int().min(1, "At least 1 bag is required"),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  development: z.string().default(""),
  deliveryAddress: addressSchema,
  donation: z.coerce.number().min(0).default(0),
  addSurcharge: z.enum(["yes", "no"]).default("no"),
});

export type LettuceFormValues = z.infer<typeof lettuceFormSchema>;

export const waitlistFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  bagsRequested: z.coerce.number().int().min(1, "At least 1 bag is required"),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
