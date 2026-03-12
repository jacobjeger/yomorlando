"use server";

import { validatePromoCode } from "@/lib/queries/promo";
import { createServiceClient } from "@/lib/supabase/server";

export async function applyPromoCode(code: string, orderType: string, subtotal: number) {
  const result = await validatePromoCode(code, orderType, subtotal);

  if (!result.valid) {
    return { valid: false as const, error: result.error };
  }

  return {
    valid: true as const,
    promoId: result.promo.id,
    code: result.promo.code,
    discountType: result.promo.discount_type,
    discountValue: result.promo.discount_value,
    discountAmount: result.discountAmount,
  };
}

export async function incrementPromoCodeUsage(promoCodeId: string) {
  const supabase = createServiceClient();
  // Fetch current usage and increment
  const { data } = await supabase
    .from("promo_codes")
    .select("current_uses")
    .eq("id", promoCodeId)
    .single();

  if (data) {
    await supabase
      .from("promo_codes")
      .update({ current_uses: data.current_uses + 1 })
      .eq("id", promoCodeId);
  }
}
