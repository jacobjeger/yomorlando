import { createServiceClient } from "@/lib/supabase/server";
import type { FaqItem } from "@/lib/database.types";

export async function getPublishedFaqItems(): Promise<FaqItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data as FaqItem[];
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data as FaqItem[];
}
