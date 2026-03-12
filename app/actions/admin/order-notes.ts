"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OrderNote } from "@/lib/database.types";

export async function getOrderNotes(orderId: string): Promise<OrderNote[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("order_notes")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  return (data ?? []) as OrderNote[];
}

export async function addOrderNote(orderId: string, note: string) {
  if (!note.trim()) throw new Error("Note cannot be empty");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("order_notes")
    .insert({ order_id: orderId, note: note.trim() });

  if (error) throw new Error("Failed to add note");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function deleteOrderNote(noteId: string, orderId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("order_notes")
    .delete()
    .eq("id", noteId);

  if (error) throw new Error("Failed to delete note");
  revalidatePath(`/admin/orders/${orderId}`);
}
