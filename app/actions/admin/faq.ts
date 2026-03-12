"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFaqItem(data: { question: string; answer: string; display_order: number; is_published: boolean }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("faq_items").insert({
    question: data.question,
    answer: data.answer,
    display_order: data.display_order,
    is_published: data.is_published,
  });

  if (error) throw new Error(`Failed to create FAQ item: ${error.message}`);

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function updateFaqItem(id: string, data: { question?: string; answer?: string; display_order?: number; is_published?: boolean }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("faq_items")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Failed to update FAQ item: ${error.message}`);

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function deleteFaqItem(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("faq_items").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete FAQ item: ${error.message}`);

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}

export async function reorderFaqItems(items: { id: string; display_order: number }[]) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  for (const item of items) {
    const { error } = await supabase
      .from("faq_items")
      .update({ display_order: item.display_order, updated_at: new Date().toISOString() })
      .eq("id", item.id);

    if (error) throw new Error(`Failed to reorder FAQ items: ${error.message}`);
  }

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { success: true };
}
