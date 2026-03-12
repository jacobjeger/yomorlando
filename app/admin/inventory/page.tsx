import { createServiceClient } from "@/lib/supabase/server";
import { InventoryPanel } from "@/components/admin/inventory-panel";
import type { Event, LettuceInventory, LettuceWaitlist } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const supabase = createServiceClient();

  // Get Pesach events with lettuce inventory
  const { data: pesachEvents } = await supabase
    .from("events")
    .select("*")
    .eq("holiday_type", "pesach")
    .order("year", { ascending: false });

  const events = (pesachEvents ?? []) as Event[];

  const inventoryData = await Promise.all(
    events.map(async (event) => {
      const { data: inventory } = await supabase
        .from("lettuce_inventory")
        .select("*")
        .eq("event_id", event.id)
        .single();

      // Count bags ordered
      const { data: orders } = await supabase
        .from("orders")
        .select("id")
        .eq("event_id", event.id)
        .eq("order_type", "lettuce");

      let bagsOrdered = 0;
      if (orders && orders.length > 0) {
        const orderIds = orders.map((o: { id: string }) => o.id);
        const { data: items } = await supabase
          .from("order_items")
          .select("quantity")
          .eq("item_type", "lettuce")
          .in("order_id", orderIds);
        bagsOrdered = (items ?? []).reduce(
          (sum: number, i: { quantity: number }) => sum + i.quantity,
          0
        );
      }

      const { data: waitlist } = await supabase
        .from("lettuce_waitlist")
        .select("*")
        .eq("event_id", event.id)
        .order("created_at", { ascending: true });

      return {
        event,
        inventory: (inventory as LettuceInventory) || null,
        bagsOrdered,
        waitlist: (waitlist ?? []) as LettuceWaitlist[],
      };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lettuce Inventory</h1>

      {inventoryData.length === 0 ? (
        <p className="text-muted-foreground">No Pesach events found.</p>
      ) : (
        <div className="space-y-6">
          {inventoryData.map((data) => (
            <InventoryPanel key={data.event.id} {...data} />
          ))}
        </div>
      )}
    </div>
  );
}
