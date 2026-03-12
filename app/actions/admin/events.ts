"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(data: {
  name: string;
  holiday_type: string;
  year: number;
  start_date: string;
  end_date: string;
  order_open: string;
  order_close: string;
}) {
  const supabase = createServiceClient();

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      name: data.name,
      holiday_type: data.holiday_type,
      year: data.year,
      start_date: data.start_date,
      end_date: data.end_date,
      order_open: data.order_open,
      order_close: data.order_close,
      is_published: false,
    })
    .select("id")
    .single();

  if (error || !event) throw new Error("Failed to create event");

  revalidatePath("/admin/events");
  return event;
}

export async function updateEvent(
  id: string,
  data: {
    name?: string;
    holiday_type?: string;
    year?: number;
    start_date?: string;
    end_date?: string;
    order_open?: string;
    order_close?: string;
    is_published?: boolean;
  }
) {
  const supabase = createServiceClient();

  const { error } = await supabase.from("events").update(data).eq("id", id);
  if (error) throw new Error("Failed to update event");

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
}

export async function togglePublished(id: string, isPublished: boolean) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("events")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) throw new Error("Failed to toggle published");
  revalidatePath("/admin/events");
}

export async function duplicateEvent(id: string) {
  const supabase = createServiceClient();

  // Get source event
  const { data: source } = await supabase.from("events").select("*").eq("id", id).single();
  if (!source) throw new Error("Event not found");

  // Create new event
  const { data: newEvent, error } = await supabase
    .from("events")
    .insert({
      name: `${source.name} (Copy)`,
      holiday_type: source.holiday_type,
      year: source.year + 1,
      start_date: source.start_date,
      end_date: source.end_date,
      order_open: source.order_open,
      order_close: source.order_close,
      is_published: false,
    })
    .select("id")
    .single();

  if (error || !newEvent) throw new Error("Failed to duplicate event");

  // Duplicate parks, ticket options, date ranges, pickup locations
  const { data: parks } = await supabase.from("parks").select("*").eq("event_id", id);
  for (const park of parks ?? []) {
    const { data: newPark } = await supabase
      .from("parks")
      .insert({
        event_id: newEvent.id,
        park_name: park.park_name,
        is_active: park.is_active,
        display_order: park.display_order,
      })
      .select("id")
      .single();

    if (!newPark) continue;

    const { data: options } = await supabase
      .from("ticket_options")
      .select("*")
      .eq("park_id", park.id);

    for (const opt of options ?? []) {
      await supabase.from("ticket_options").insert({
        park_id: newPark.id,
        option_code: opt.option_code,
        label: opt.label,
        description: opt.description,
        price_child: opt.price_child,
        price_adult: opt.price_adult,
        includes_epic: opt.includes_epic,
        date_restriction_start: opt.date_restriction_start,
        date_restriction_end: opt.date_restriction_end,
        child_age_min: opt.child_age_min,
        child_age_max: opt.child_age_max,
        adult_age_min: opt.adult_age_min,
        is_active: opt.is_active,
        display_order: opt.display_order,
      });
    }

    const { data: ranges } = await supabase
      .from("event_date_ranges")
      .select("*")
      .eq("park_id", park.id);

    for (const range of ranges ?? []) {
      await supabase.from("event_date_ranges").insert({
        park_id: newPark.id,
        label: range.label,
        range_start: range.range_start,
        range_end: range.range_end,
      });
    }
  }

  const { data: locations } = await supabase
    .from("pickup_locations")
    .select("*")
    .eq("event_id", id);

  for (const loc of locations ?? []) {
    await supabase.from("pickup_locations").insert({
      event_id: newEvent.id,
      name: loc.name,
      address: loc.address,
      notes: loc.notes,
    });
  }

  // Duplicate lettuce inventory
  const { data: inventory } = await supabase
    .from("lettuce_inventory")
    .select("*")
    .eq("event_id", id)
    .single();

  if (inventory) {
    await supabase.from("lettuce_inventory").insert({
      event_id: newEvent.id,
      max_bags: inventory.max_bags,
      is_waitlist_active: false,
    });
  }

  revalidatePath("/admin/events");
  return newEvent;
}

export async function addPark(eventId: string, parkName: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("parks")
    .insert({ event_id: eventId, park_name: parkName, is_active: true, display_order: 0 })
    .select("id")
    .single();
  if (error) throw new Error("Failed to add park");
  revalidatePath(`/admin/events/${eventId}`);
  return data;
}

export async function addTicketOption(parkId: string, data: {
  option_code: string;
  label: string;
  description: string;
  price_child: number;
  price_adult: number;
  includes_epic: boolean;
  child_age_min: number;
  child_age_max: number | null;
  adult_age_min: number;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("ticket_options").insert({
    park_id: parkId,
    ...data,
    is_active: true,
    display_order: 0,
  });
  if (error) throw new Error("Failed to add ticket option");
}

export async function addDateRange(parkId: string, data: {
  label: string;
  range_start: string;
  range_end: string;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("event_date_ranges").insert({
    park_id: parkId,
    ...data,
  });
  if (error) throw new Error("Failed to add date range");
}

export async function addPickupLocation(eventId: string, data: {
  name: string;
  address: string;
  notes: string;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("pickup_locations").insert({
    event_id: eventId,
    ...data,
  });
  if (error) throw new Error("Failed to add pickup location");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function updateLettuceInventory(eventId: string, maxBags: number) {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("lettuce_inventory")
    .select("id")
    .eq("event_id", eventId)
    .single();

  if (existing) {
    await supabase.from("lettuce_inventory").update({ max_bags: maxBags }).eq("event_id", eventId);
  } else {
    await supabase.from("lettuce_inventory").insert({ event_id: eventId, max_bags: maxBags });
  }

  revalidatePath(`/admin/events/${eventId}`);
}

export async function deleteEvent(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error("Failed to delete event");
  revalidatePath("/admin/events");
}

export async function deletePark(parkId: string, eventId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("parks").delete().eq("id", parkId);
  if (error) throw new Error("Failed to delete park");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function deleteTicketOption(optionId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("ticket_options").delete().eq("id", optionId);
  if (error) throw new Error("Failed to delete ticket option");
}

export async function updateTicketOption(
  optionId: string,
  data: {
    option_code?: string;
    label?: string;
    description?: string;
    price_child?: number;
    price_adult?: number;
    includes_epic?: boolean;
    date_restriction_start?: string | null;
    date_restriction_end?: string | null;
    child_age_min?: number;
    child_age_max?: number | null;
    adult_age_min?: number;
    is_active?: boolean;
    display_order?: number;
  }
) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("ticket_options").update(data).eq("id", optionId);
  if (error) throw new Error("Failed to update ticket option");
}

export async function deleteDateRange(rangeId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("event_date_ranges").delete().eq("id", rangeId);
  if (error) throw new Error("Failed to delete date range");
}

export async function updateDateRange(
  rangeId: string,
  data: { label?: string; range_start?: string; range_end?: string }
) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("event_date_ranges").update(data).eq("id", rangeId);
  if (error) throw new Error("Failed to update date range");
}

export async function deletePickupLocation(locationId: string, eventId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("pickup_locations").delete().eq("id", locationId);
  if (error) throw new Error("Failed to delete pickup location");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function updatePickupLocation(
  locationId: string,
  data: { name?: string; address?: string; notes?: string }
) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("pickup_locations").update(data).eq("id", locationId);
  if (error) throw new Error("Failed to update pickup location");
}
