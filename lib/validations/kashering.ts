import { z } from "zod";
import { addressSchema, nameSchema, contactSchema } from "./common";

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

export const kasheringFormSchema = z
  .object({
    ...nameSchema.shape,
    ...contactSchema.shape,
    billingAddress: addressSchema,
    villaAddress: addressSchema.optional(),
    development: z.string().min(1, "Development is required"),
    developmentOther: z.string().optional(),
    accessDay: z.string().min(1, "Access day is required"),
    numBedrooms: z.number().int().min(1, "Number of bedrooms is required"),
    numHouses: z.number().int().min(1, "At least 1 house is required"),
    shulMembership: z.boolean().default(false),
    ringSetQty: z.number().int().min(0).default(0),
    counterRollQty: z.number().int().min(0).default(0),
    donation: z.number().min(0).default(0),
    addSurcharge: z.enum(["yes", "no"]).default("no"),
  })
  .refine(
    (data) => {
      if (data.development === "Other") {
        return !!data.developmentOther && data.developmentOther.length > 0;
      }
      return true;
    },
    {
      message: "Please specify the development name",
      path: ["developmentOther"],
    }
  );

export type KasheringFormValues = z.infer<typeof kasheringFormSchema>;
