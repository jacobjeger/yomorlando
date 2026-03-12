import { createServiceClient } from "@/lib/supabase/server";
import type { LettuceInventory } from "@/lib/database.types";

export async function getLettuceInventory(
  eventId: string
): Promise<LettuceInventory | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("lettuce_inventory")
    .select("*")
    .eq("event_id", eventId)
    .single();

  if (error) return null;
  return data as LettuceInventory;
}

export async function getBagsOrdered(eventId: string): Promise<number> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("order_items")
    .select("quantity, order_id")
    .eq("item_type", "lettuce");

  if (!data) return 0;

  // Filter by event — need to join through orders
  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("event_id", eventId)
    .eq("order_type", "lettuce");

  if (!orders) return 0;

  const orderIds = new Set(orders.map((o: { id: string }) => o.id));
  return data
    .filter((item: { order_id: string }) => orderIds.has(item.order_id))
    .reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
}
