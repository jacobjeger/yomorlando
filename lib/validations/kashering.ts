import { z } from "zod";
import { addressSchema } from "./common";

export const DEVELOPMENTS = [
  "Solara",
  "Windsor Westside",
  "Windsor Island",
  "Solterra",
  "Encore",
  "Reunion",
  "Champions Gate",
  "Eden Gardens",
  "Villatel Village",
  "Other",
] as const;

export const kasheringFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  billingAddress: addressSchema,
  villaAddress: addressSchema,
  development: z.string().min(1, "Development is required"),
  developmentOther: z.string().default(""),
  accessDay: z.string().min(1, "Access day is required"),
  numBedrooms: z.coerce.number().int().min(1, "Number of bedrooms is required"),
  numHouses: z.coerce.number().int().min(1, "At least 1 house is required"),
  shulMembership: z.boolean().default(false),
  ringSetQty: z.coerce.number().int().min(0).default(0),
  counterRollQty: z.coerce.number().int().min(0).default(0),
  donation: z.coerce.number().min(0).default(0),
  addSurcharge: z.enum(["yes", "no"]).default("no"),
});

export type KasheringFormValues = z.infer<typeof kasheringFormSchema>;
