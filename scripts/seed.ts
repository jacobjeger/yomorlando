import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Seeding database...");

  // 1. Create Pesach 2026 event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      name: "Pesach 2026",
      holiday_type: "pesach",
      year: 2026,
      start_date: "2026-04-01",
      end_date: "2026-04-16",
      order_open: "2026-01-15T00:00:00Z",
      order_close: "2026-03-25T23:59:59Z",
      is_published: true,
    })
    .select("id")
    .single();

  if (eventError || !event) {
    console.error("Failed to create event:", eventError);
    process.exit(1);
  }

  console.log(`Created event: ${event.id}`);

  // 2. Create Parks
  const { data: universalPark } = await supabase
    .from("parks")
    .insert({ event_id: event.id, park_name: "universal", is_active: true, display_order: 0 })
    .select("id")
    .single();

  const { data: seaworldPark } = await supabase
    .from("parks")
    .insert({ event_id: event.id, park_name: "seaworld", is_active: true, display_order: 1 })
    .select("id")
    .single();

  const { data: disneyPark } = await supabase
    .from("parks")
    .insert({ event_id: event.id, park_name: "disney", is_active: true, display_order: 2 })
    .select("id")
    .single();

  if (!universalPark || !seaworldPark || !disneyPark) {
    console.error("Failed to create parks");
    process.exit(1);
  }

  console.log("Created parks: Universal, SeaWorld, Disney");

  // 3. Universal Date Ranges
  await supabase.from("event_date_ranges").insert([
    {
      park_id: universalPark.id,
      label: "Week 1 (Apr 1–8)",
      range_start: "2026-04-01",
      range_end: "2026-04-08",
    },
    {
      park_id: universalPark.id,
      label: "Week 2 (Apr 9–16)",
      range_start: "2026-04-09",
      range_end: "2026-04-16",
    },
  ]);

  console.log("Created Universal date ranges");

  // 4. Universal Ticket Options (7 options)
  await supabase.from("ticket_options").insert([
    {
      park_id: universalPark.id,
      option_code: "U2D",
      label: "2-Day Base Ticket",
      description: "2-day admission to Universal Studios and Islands of Adventure",
      price_child: 18500,
      price_adult: 20500,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 0,
    },
    {
      park_id: universalPark.id,
      option_code: "U3D",
      label: "3-Day Base Ticket",
      description: "3-day admission to Universal Studios and Islands of Adventure",
      price_child: 21000,
      price_adult: 23500,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 1,
    },
    {
      park_id: universalPark.id,
      option_code: "U2PH",
      label: "2-Day Park-to-Park Hopper",
      description: "2-day park-to-park access including all Universal parks",
      price_child: 24500,
      price_adult: 27000,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 2,
    },
    {
      park_id: universalPark.id,
      option_code: "U3PH",
      label: "3-Day Park-to-Park Hopper",
      description: "3-day park-to-park access including all Universal parks",
      price_child: 28000,
      price_adult: 31000,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 3,
    },
    {
      park_id: universalPark.id,
      option_code: "U2E",
      label: "2-Day Base + Epic Universe",
      description: "2-day admission including Epic Universe",
      price_child: 27500,
      price_adult: 30000,
      includes_epic: true,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 4,
    },
    {
      park_id: universalPark.id,
      option_code: "U3E",
      label: "3-Day Base + Epic Universe",
      description: "3-day admission including Epic Universe",
      price_child: 32000,
      price_adult: 35500,
      includes_epic: true,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 5,
    },
    {
      park_id: universalPark.id,
      option_code: "U3PHE",
      label: "3-Day Park-to-Park + Epic Universe",
      description: "3-day park-to-park including Epic Universe",
      price_child: 38000,
      price_adult: 42000,
      includes_epic: true,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 6,
    },
  ]);

  console.log("Created 7 Universal ticket options");

  // 5. SeaWorld Ticket Options (2 options)
  await supabase.from("ticket_options").insert([
    {
      park_id: seaworldPark.id,
      option_code: "SW1",
      label: "1-Day SeaWorld",
      description: "Single-day admission to SeaWorld Orlando",
      price_child: 8500,
      price_adult: 9500,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 0,
    },
    {
      park_id: seaworldPark.id,
      option_code: "SW2",
      label: "2-Day SeaWorld + Aquatica Combo",
      description: "2-day combo admission to SeaWorld and Aquatica",
      price_child: 12000,
      price_adult: 14000,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 1,
    },
  ]);

  // SeaWorld date ranges
  await supabase.from("event_date_ranges").insert([
    {
      park_id: seaworldPark.id,
      label: "Week 1 (Apr 1–8)",
      range_start: "2026-04-01",
      range_end: "2026-04-08",
    },
    {
      park_id: seaworldPark.id,
      label: "Week 2 (Apr 9–16)",
      range_start: "2026-04-09",
      range_end: "2026-04-16",
    },
  ]);

  console.log("Created 2 SeaWorld ticket options");

  // 6. Disney Ticket Options (6 options)
  await supabase.from("ticket_options").insert([
    {
      park_id: disneyPark.id,
      option_code: "D1B",
      label: "1-Day Base Ticket",
      description: "Single-day admission to one Disney World theme park",
      price_child: 11500,
      price_adult: 12500,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 0,
    },
    {
      park_id: disneyPark.id,
      option_code: "D2B",
      label: "2-Day Base Ticket",
      description: "2-day admission to one Disney World theme park per day",
      price_child: 21500,
      price_adult: 23500,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 1,
    },
    {
      park_id: disneyPark.id,
      option_code: "D3B",
      label: "3-Day Base Ticket",
      description: "3-day admission to one Disney World theme park per day",
      price_child: 30000,
      price_adult: 33000,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 2,
    },
    {
      park_id: disneyPark.id,
      option_code: "D1PH",
      label: "1-Day Park Hopper",
      description: "Single-day park-hopper admission to all Disney theme parks",
      price_child: 17500,
      price_adult: 19000,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 3,
    },
    {
      park_id: disneyPark.id,
      option_code: "D2PH",
      label: "2-Day Park Hopper",
      description: "2-day park-hopper admission to all Disney theme parks",
      price_child: 28000,
      price_adult: 30500,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 4,
    },
    {
      park_id: disneyPark.id,
      option_code: "D3PH",
      label: "3-Day Park Hopper",
      description: "3-day park-hopper admission to all Disney theme parks",
      price_child: 37000,
      price_adult: 40500,
      includes_epic: false,
      child_age_min: 3,
      child_age_max: 9,
      adult_age_min: 10,
      display_order: 5,
    },
  ]);

  // Disney date ranges
  await supabase.from("event_date_ranges").insert([
    {
      park_id: disneyPark.id,
      label: "Week 1 (Apr 1–8)",
      range_start: "2026-04-01",
      range_end: "2026-04-08",
    },
    {
      park_id: disneyPark.id,
      label: "Week 2 (Apr 9–16)",
      range_start: "2026-04-09",
      range_end: "2026-04-16",
    },
  ]);

  console.log("Created 6 Disney ticket options");

  // 7. Pickup Location
  await supabase.from("pickup_locations").insert({
    event_id: event.id,
    name: "Solara Resort",
    address: "8901 ChampionsGate Blvd, ChampionsGate, FL 33896",
    notes: "Meet at the main clubhouse entrance",
  });

  console.log("Created pickup location: Solara Resort");

  // 8. Lettuce Inventory
  await supabase.from("lettuce_inventory").insert({
    event_id: event.id,
    max_bags: 200,
    is_waitlist_active: false,
  });

  console.log("Created lettuce inventory (200 bags)");

  console.log("\nSeed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
