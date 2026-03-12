import { createServiceClient } from "@/lib/supabase/server";
import type { Event, Park, TicketOption, EventDateRange, PickupLocation, HolidayType, EventWithParks } from "@/lib/database.types";

function isConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function getUpcomingEvents(): Promise<Event[]> {
  if (!isConfigured()) return [];

  try {
    const supabase = createServiceClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gt("order_close", now)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching upcoming events:", error);
      return [];
    }

    return (data ?? []) as Event[];
  } catch (e) {
    console.error("Failed to fetch upcoming events:", e);
    return [];
  }
}

export async function getPastEvents(): Promise<Event[]> {
  if (!isConfigured()) return [];

  try {
    const supabase = createServiceClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .lte("order_close", now)
      .order("start_date", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching past events:", error);
      return [];
    }

    return (data ?? []) as Event[];
  } catch (e) {
    console.error("Failed to fetch past events:", e);
    return [];
  }
}

export async function getLatestEventByHoliday(
  holidayType: HolidayType
): Promise<Event | null> {
  if (!isConfigured()) return null;

  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .eq("holiday_type", holidayType)
      .order("year", { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data as Event;
  } catch {
    return null;
  }
}

export async function getEventWithParks(
  eventId: string
): Promise<EventWithParks | null> {
  if (!isConfigured()) return null;

  try {
    const supabase = createServiceClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) return null;

    const { data: parks } = await supabase
      .from("parks")
      .select("*")
      .eq("event_id", eventId)
      .eq("is_active", true)
      .order("display_order");

    const { data: pickupLocations } = await supabase
      .from("pickup_locations")
      .select("*")
      .eq("event_id", eventId);

    const typedParks = (parks ?? []) as Park[];

    const parksWithOptions = await Promise.all(
      typedParks.map(async (park) => {
        const { data: ticketOptions } = await supabase
          .from("ticket_options")
          .select("*")
          .eq("park_id", park.id)
          .eq("is_active", true)
          .order("display_order");

        const { data: dateRanges } = await supabase
          .from("event_date_ranges")
          .select("*")
          .eq("park_id", park.id);

        return {
          ...park,
          ticket_options: (ticketOptions ?? []) as TicketOption[],
          event_date_ranges: (dateRanges ?? []) as EventDateRange[],
        };
      })
    );

    return {
      ...(event as Event),
      parks: parksWithOptions,
      pickup_locations: (pickupLocations ?? []) as PickupLocation[],
    };
  } catch {
    return null;
  }
}

export async function getOpenEventForHoliday(
  holidayType: HolidayType
): Promise<Event | null> {
  if (!isConfigured()) return null;

  try {
    const supabase = createServiceClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .eq("holiday_type", holidayType)
      .lte("order_open", now)
      .gt("order_close", now)
      .order("year", { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data as Event;
  } catch {
    return null;
  }
}
