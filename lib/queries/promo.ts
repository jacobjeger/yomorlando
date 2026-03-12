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
  subtotal: number
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
  if (promo.discount_type === "percentage") {
    discountAmount = Math.round(subtotal * (promo.discount_value / 100));
  } else {
    discountAmount = Math.min(promo.discount_value, subtotal);
  }

  return { valid: true, promo, discountAmount };
}
