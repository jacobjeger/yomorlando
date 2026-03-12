"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreatePromoData {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  applies_to: string;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

export async function createPromoCode(data: CreatePromoData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("promo_codes").insert({
    code: data.code.toUpperCase().trim(),
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    min_order_amount: data.min_order_amount,
    max_uses: data.max_uses,
    applies_to: data.applies_to,
    valid_from: data.valid_from,
    valid_until: data.valid_until,
    is_active: data.is_active,
  });

  if (error) {
    if (error.code === "23505") throw new Error("A promo code with this code already exists");
    throw new Error(`Failed to create promo code: ${error.message}`);
  }

  revalidatePath("/admin/promo-codes");
  return { success: true };
}

export async function updatePromoCode(id: string, data: Partial<CreatePromoData>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const update: Record<string, unknown> = { ...data };
  if (data.code) update.code = data.code.toUpperCase().trim();

  const { error } = await supabase.from("promo_codes").update(update).eq("id", id);

  if (error) throw new Error(`Failed to update promo code: ${error.message}`);

  revalidatePath("/admin/promo-codes");
  return { success: true };
}

export async function deletePromoCode(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("promo_codes").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete promo code: ${error.message}`);

  revalidatePath("/admin/promo-codes");
  return { success: true };
}
