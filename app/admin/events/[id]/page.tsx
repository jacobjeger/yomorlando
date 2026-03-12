import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { EventEditor } from "@/components/admin/event-editor";
import type { Event, Park, TicketOption, EventDateRange, PickupLocation, LettuceInventory } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServiceClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!event) notFound();

  const { data: parks } = await supabase
    .from("parks")
    .select("*")
    .eq("event_id", params.id)
    .order("display_order");

  const { data: ticketOptions } = await supabase
    .from("ticket_options")
    .select("*")
    .in("park_id", (parks ?? []).map((p: Park) => p.id))
    .order("display_order");

  const { data: dateRanges } = await supabase
    .from("event_date_ranges")
    .select("*")
    .in("park_id", (parks ?? []).map((p: Park) => p.id));

  const { data: pickupLocations } = await supabase
    .from("pickup_locations")
    .select("*")
    .eq("event_id", params.id);

  const { data: lettuceInventory } = await supabase
    .from("lettuce_inventory")
    .select("*")
    .eq("event_id", params.id)
    .single();

  return (
    <EventEditor
      event={event as Event}
      parks={(parks ?? []) as Park[]}
      ticketOptions={(ticketOptions ?? []) as TicketOption[]}
      dateRanges={(dateRanges ?? []) as EventDateRange[]}
      pickupLocations={(pickupLocations ?? []) as PickupLocation[]}
      lettuceInventory={(lettuceInventory as LettuceInventory) || null}
    />
  );
}
