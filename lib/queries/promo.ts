import { createServiceClient } from "@/lib/supabase/server";
import type { PromoCode } from "@/lib/database.types";

export async function getAllPromoCodes(): Promise<PromoCode[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as PromoCode[];
}

export async function validatePromoCode(
  code: string,
  orderType: string,
  subtotal: number,
  context?: { shippingFee?: number; itemCount?: number }
): Promise<{ valid: false; error: string } | { valid: true; promo: PromoCode; discountAmount: number }> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return { valid: false, error: "Invalid promo code" };
  }

  const promo = data as PromoCode;

  // Check applies_to
  if (promo.applies_to !== "all" && promo.applies_to !== orderType) {
    return { valid: false, error: "This code doesn't apply to this order type" };
  }

  // Check usage limits
  if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
    return { valid: false, error: "This code has reached its usage limit" };
  }

  // Check date validity
  const now = new Date();
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    return { valid: false, error: "This code is not yet active" };
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    return { valid: false, error: "This code has expired" };
  }

  // Check minimum order
  if (subtotal < promo.min_order_amount) {
    return { valid: false, error: `Minimum order of $${(promo.min_order_amount / 100).toFixed(2)} required` };
  }

  // Calculate discount
  let discountAmount: number;
  switch (promo.discount_type) {
    case "percentage":
      discountAmount = Math.round(subtotal * (promo.discount_value / 100));
      break;
    case "fixed":
      discountAmount = Math.min(promo.discount_value, subtotal);
      break;
    case "bogo":
      // Buy one get one free — discount equals half the subtotal (every 2nd item free)
      discountAmount = Math.round(subtotal / 2);
      break;
    case "free_shipping":
      // Discount equals the shipping/delivery fee
      discountAmount = context?.shippingFee ?? 0;
      if (discountAmount === 0) {
        return { valid: false, error: "No shipping fee to waive on this order" };
      }
      break;
    case "flat_per_item":
      // Fixed amount off per item (discount_value is cents per item)
      discountAmount = Math.min((context?.itemCount ?? 1) * promo.discount_value, subtotal);
      break;
    default:
      discountAmount = 0;
  }

  // Apply max discount cap if set
  if (promo.max_discount_amount !== null && discountAmount > promo.max_discount_amount) {
    discountAmount = promo.max_discount_amount;
  }

  // Never discount more than the subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  return { valid: true, promo, discountAmount };
}
