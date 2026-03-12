import { z } from "zod";

export const addressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip code is required"),
  country: z.string().optional().default("US"),
});

export const internationalAddressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip: z.string().min(1, "Zip/Postal code is required"),
  country: z.string().min(1, "Country is required").default("US"),
});

export const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const contactSchema = z.object({
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
});
