import { z } from "zod";
import { addressSchema, nameSchema, contactSchema } from "./common";

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

export const lettuceFormSchema = z
  .object({
    ...nameSchema.shape,
    ...contactSchema.shape,
    bags: z.number().int().min(1, "At least 1 bag is required"),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    development: z.string().optional(),
    deliveryAddress: addressSchema.optional(),
    donation: z.number().min(0).default(0),
    addSurcharge: z.enum(["yes", "no"]).default("no"),
  })
  .refine(
    (data) => {
      if (data.deliveryMethod === "delivery") {
        return !!data.development && data.development.length > 0;
      }
      return true;
    },
    {
      message: "Please select a development for delivery",
      path: ["development"],
    }
  )
  .refine(
    (data) => {
      if (data.deliveryMethod === "delivery") {
        return !!data.deliveryAddress?.line1;
      }
      return true;
    },
    {
      message: "Delivery address is required",
      path: ["deliveryAddress", "line1"],
    }
  );

export type LettuceFormValues = z.infer<typeof lettuceFormSchema>;

export const waitlistFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  bagsRequested: z.number().int().min(1, "At least 1 bag is required"),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
