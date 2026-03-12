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

  // 9. Fetch ticket option IDs for order items
  const { data: ticketOptions } = await supabase
    .from("ticket_options")
    .select("id, option_code, price_child, price_adult, park_id");

  const optionsByCode: Record<string, { id: string; price_child: number; price_adult: number }> = {};
  for (const opt of ticketOptions || []) {
    optionsByCode[opt.option_code] = { id: opt.id, price_child: opt.price_child, price_adult: opt.price_adult };
  }

  // 10. Sample Ticket Orders
  const ticketOrders = [
    {
      customer_name: "David Goldstein",
      customer_email: "david.goldstein@example.com",
      customer_phone: "(305) 555-0101",
      customer_address: { line1: "1234 Palm Ave", city: "Miami", state: "FL", zip: "33101" },
      items: [
        { code: "U3PHE", age: "adult" as const, qty: 2, date: "2026-04-02" },
        { code: "U3PHE", age: "child" as const, qty: 3, date: "2026-04-02" },
      ],
      fulfillment_status: "pending" as const,
      how_heard: "Shul announcement",
      comments: "Please group our tickets together",
    },
    {
      customer_name: "Sarah Levy",
      customer_email: "sarah.levy@example.com",
      customer_phone: "(954) 555-0202",
      customer_address: { line1: "567 Ocean Dr", city: "Fort Lauderdale", state: "FL", zip: "33301" },
      items: [
        { code: "D2PH", age: "adult" as const, qty: 2, date: "2026-04-05" },
        { code: "D2PH", age: "child" as const, qty: 1, date: "2026-04-05" },
        { code: "SW1", age: "adult" as const, qty: 2, date: "2026-04-08" },
      ],
      fulfillment_status: "fulfilled" as const,
      how_heard: "Friend referral",
    },
    {
      customer_name: "Moshe Katz",
      customer_email: "moshe.katz@example.com",
      customer_phone: "(407) 555-0303",
      customer_address: { line1: "890 Lake View Ct", city: "Orlando", state: "FL", zip: "32801" },
      items: [
        { code: "U2E", age: "adult" as const, qty: 4, date: "2026-04-10" },
        { code: "U2E", age: "child" as const, qty: 2, date: "2026-04-10" },
      ],
      fulfillment_status: "pending" as const,
      how_heard: "Website",
    },
    {
      customer_name: "Rachel Cohen",
      customer_email: "rachel.cohen@example.com",
      customer_phone: "(718) 555-0404",
      customer_address: { line1: "45 Eastern Pkwy", city: "Brooklyn", state: "NY", zip: "11213" },
      items: [
        { code: "D3PH", age: "adult" as const, qty: 2, date: "2026-04-01" },
        { code: "D3PH", age: "child" as const, qty: 4, date: "2026-04-01" },
        { code: "SW2", age: "adult" as const, qty: 2, date: "2026-04-06" },
        { code: "SW2", age: "child" as const, qty: 4, date: "2026-04-06" },
      ],
      fulfillment_status: "shipped" as const,
      how_heard: "Instagram",
      comments: "Traveling from NY, arriving March 31",
    },
    {
      customer_name: "Avi Berkowitz",
      customer_email: "avi.berkowitz@example.com",
      customer_phone: "(561) 555-0505",
      customer_address: { line1: "2100 Congress Ave", city: "Boca Raton", state: "FL", zip: "33431" },
      items: [
        { code: "U2D", age: "adult" as const, qty: 2, date: "2026-04-12" },
        { code: "U2D", age: "child" as const, qty: 3, date: "2026-04-12" },
      ],
      fulfillment_status: "pending" as const,
    },
    {
      customer_name: "Miriam Shapiro",
      customer_email: "miriam.shapiro@example.com",
      customer_phone: "(347) 555-0606",
      customer_address: { line1: "78 Main St", city: "Lakewood", state: "NJ", zip: "08701" },
      items: [
        { code: "D1B", age: "adult" as const, qty: 6, date: "2026-04-03" },
        { code: "D1B", age: "child" as const, qty: 5, date: "2026-04-03" },
      ],
      fulfillment_status: "fulfilled" as const,
      how_heard: "WhatsApp group",
    },
    {
      customer_name: "Yossi Friedman",
      customer_email: "yossi.friedman@example.com",
      customer_phone: "(786) 555-0707",
      customer_address: { line1: "3300 Aventura Blvd", city: "Aventura", state: "FL", zip: "33180" },
      items: [
        { code: "U3PH", age: "adult" as const, qty: 2, date: "2026-04-09" },
        { code: "U3PH", age: "child" as const, qty: 1, date: "2026-04-09" },
        { code: "SW1", age: "child" as const, qty: 1, date: "2026-04-14" },
        { code: "SW1", age: "adult" as const, qty: 2, date: "2026-04-14" },
      ],
      fulfillment_status: "pending" as const,
      how_heard: "Returning customer",
    },
    {
      customer_name: "Chana Weiss",
      customer_email: "chana.weiss@example.com",
      customer_phone: "(443) 555-0808",
      customer_address: { line1: "5600 Park Heights Ave", city: "Baltimore", state: "MD", zip: "21215" },
      items: [
        { code: "D2B", age: "adult" as const, qty: 2, date: "2026-04-11" },
        { code: "D2B", age: "child" as const, qty: 3, date: "2026-04-11" },
      ],
      fulfillment_status: "pending" as const,
      how_heard: "Flyer",
      comments: "First time visiting Orlando!",
    },
  ];

  for (const order of ticketOrders) {
    let subtotal = 0;
    const itemRows = order.items.map((item) => {
      const opt = optionsByCode[item.code];
      const unitPrice = item.age === "child" ? opt.price_child : opt.price_adult;
      const lineTotal = unitPrice * item.qty;
      subtotal += lineTotal;
      return {
        ticket_option_id: opt.id,
        item_type: "ticket",
        description: `${item.code} (${item.age})`,
        quantity: item.qty,
        unit_price: unitPrice,
        subtotal: lineTotal,
        age_category: item.age,
        visit_date: item.date,
      };
    });

    const surcharge = Math.round(subtotal * 0.03);
    const total = subtotal + surcharge;

    const { data: orderRow } = await supabase
      .from("orders")
      .insert({
        event_id: event.id,
        order_type: "tickets",
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        subtotal,
        surcharge,
        donation: 0,
        total,
        fulfillment_status: order.fulfillment_status,
        how_heard: order.how_heard || null,
        comments: order.comments || null,
      })
      .select("id")
      .single();

    if (orderRow) {
      await supabase
        .from("order_items")
        .insert(itemRows.map((r) => ({ ...r, order_id: orderRow.id })));
    }
  }

  console.log(`Created ${ticketOrders.length} ticket orders`);

  // 11. Sample Kashering Orders
  const kasheringOrders = [
    {
      customer_name: "Eli Rosenbaum",
      customer_email: "eli.rosenbaum@example.com",
      customer_phone: "(212) 555-0901",
      customer_address: { line1: "120 Broadway", city: "New York", state: "NY", zip: "10005" },
      villa_address: { line1: "1500 Solara Resort Dr", city: "Kissimmee", state: "FL", zip: "34747" },
      development: "Solara Resort",
      access_day: "2026-03-30",
      num_bedrooms: 5,
      num_houses: 1,
      shul_membership: true,
      fulfillment_status: "pending" as const,
      how_heard: "Rabbi recommendation",
    },
    {
      customer_name: "Batya Stern",
      customer_email: "batya.stern@example.com",
      customer_phone: "(845) 555-1002",
      customer_address: { line1: "40 College Rd", city: "Monsey", state: "NY", zip: "10952" },
      villa_address: { line1: "7700 Windsor Hills Dr", city: "Kissimmee", state: "FL", zip: "34747" },
      development: "Windsor Hills",
      access_day: "2026-03-31",
      num_bedrooms: 7,
      num_houses: 1,
      shul_membership: false,
      fulfillment_status: "fulfilled" as const,
      how_heard: "Friend referral",
      comments: "Need extra-large kitchen covered",
    },
    {
      customer_name: "Shmuel Green",
      customer_email: "shmuel.green@example.com",
      customer_phone: "(410) 555-1103",
      customer_address: { line1: "3400 Seven Mile Ln", city: "Baltimore", state: "MD", zip: "21208" },
      villa_address: { line1: "2900 Champions Gate Blvd", city: "Davenport", state: "FL", zip: "33896" },
      development: "ChampionsGate",
      access_day: "2026-03-31",
      num_bedrooms: 6,
      num_houses: 2,
      shul_membership: true,
      fulfillment_status: "pending" as const,
      how_heard: "WhatsApp group",
      comments: "Two side-by-side villas, both need kashering",
    },
    {
      customer_name: "Leah Adler",
      customer_email: "leah.adler@example.com",
      customer_phone: "(732) 555-1204",
      customer_address: { line1: "210 Clifton Ave", city: "Lakewood", state: "NJ", zip: "08701" },
      villa_address: { line1: "3100 Storey Lake Blvd", city: "Kissimmee", state: "FL", zip: "34746" },
      development: "Storey Lake",
      access_day: "2026-03-29",
      num_bedrooms: 4,
      num_houses: 1,
      shul_membership: false,
      fulfillment_status: "pending" as const,
    },
  ];

  // Kashering base price: $350/house + $50/bedroom, shul discount 10%
  for (const order of kasheringOrders) {
    let subtotal = (35000 * order.num_houses) + (5000 * order.num_bedrooms);
    if (order.shul_membership) {
      subtotal = Math.round(subtotal * 0.9);
    }
    const surcharge = Math.round(subtotal * 0.03);
    const total = subtotal + surcharge;

    const { data: orderRow } = await supabase
      .from("orders")
      .insert({
        event_id: event.id,
        order_type: "kashering",
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        subtotal,
        surcharge,
        donation: 0,
        total,
        fulfillment_status: order.fulfillment_status,
        how_heard: order.how_heard || null,
        comments: order.comments || null,
      })
      .select("id")
      .single();

    if (orderRow) {
      await supabase.from("order_items").insert({
        order_id: orderRow.id,
        item_type: "kashering",
        description: `Kashering - ${order.development} (${order.num_bedrooms}BR x${order.num_houses})`,
        quantity: order.num_houses,
        unit_price: subtotal / order.num_houses,
        subtotal,
      });

      await supabase.from("kashering_details").insert({
        order_id: orderRow.id,
        villa_address: order.villa_address,
        development: order.development,
        access_day: order.access_day,
        num_bedrooms: order.num_bedrooms,
        num_houses: order.num_houses,
        shul_membership: order.shul_membership,
      });
    }
  }

  console.log(`Created ${kasheringOrders.length} kashering orders`);

  // 12. Sample Lettuce Orders
  const lettuceOrders = [
    {
      customer_name: "Rivka Goldberg",
      customer_email: "rivka.goldberg@example.com",
      customer_phone: "(305) 555-1301",
      customer_address: { line1: "8800 Collins Ave", city: "Surfside", state: "FL", zip: "33154" },
      bags: 3,
      fulfillment_status: "pending" as const,
      how_heard: "Email newsletter",
    },
    {
      customer_name: "Yaakov Roth",
      customer_email: "yaakov.roth@example.com",
      customer_phone: "(917) 555-1402",
      customer_address: { line1: "1400 Ave J", city: "Brooklyn", state: "NY", zip: "11230" },
      bags: 5,
      fulfillment_status: "fulfilled" as const,
      how_heard: "Shul announcement",
      comments: "Picking up at Solara",
    },
    {
      customer_name: "Penina Schwartz",
      customer_email: "penina.schwartz@example.com",
      customer_phone: "(954) 555-1503",
      customer_address: { line1: "4200 Stirling Rd", city: "Davie", state: "FL", zip: "33314" },
      bags: 2,
      fulfillment_status: "picked_up" as const,
    },
    {
      customer_name: "Aryeh Marcus",
      customer_email: "aryeh.marcus@example.com",
      customer_phone: "(786) 555-1604",
      customer_address: { line1: "19000 NE 25th Ave", city: "North Miami Beach", state: "FL", zip: "33180" },
      bags: 4,
      fulfillment_status: "pending" as const,
      how_heard: "Website",
    },
    {
      customer_name: "Shira Blum",
      customer_email: "shira.blum@example.com",
      customer_phone: "(561) 555-1705",
      customer_address: { line1: "9500 Glades Rd", city: "Boca Raton", state: "FL", zip: "33434" },
      bags: 6,
      fulfillment_status: "pending" as const,
      how_heard: "Friend referral",
      comments: "Need delivery to Reunion Resort",
    },
  ];

  const pricePerBag = 1800; // $18.00 per bag

  for (const order of lettuceOrders) {
    const subtotal = pricePerBag * order.bags;
    const total = subtotal; // no surcharge on lettuce
    const { data: orderRow } = await supabase
      .from("orders")
      .insert({
        event_id: event.id,
        order_type: "lettuce",
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        subtotal,
        surcharge: 0,
        donation: 0,
        total,
        fulfillment_status: order.fulfillment_status,
        how_heard: order.how_heard || null,
        comments: order.comments || null,
      })
      .select("id")
      .single();

    if (orderRow) {
      await supabase.from("order_items").insert({
        order_id: orderRow.id,
        item_type: "lettuce",
        description: "Bug-free romaine lettuce bag",
        quantity: order.bags,
        unit_price: pricePerBag,
        subtotal,
      });
    }
  }

  console.log(`Created ${lettuceOrders.length} lettuce orders`);

  // 13. Sample Lettuce Waitlist Entries
  await supabase.from("lettuce_waitlist").insert([
    {
      event_id: event.id,
      name: "Dov Singer",
      email: "dov.singer@example.com",
      phone: "(845) 555-1801",
      bags_requested: 3,
    },
    {
      event_id: event.id,
      name: "Tova Klein",
      email: "tova.klein@example.com",
      phone: "(646) 555-1902",
      bags_requested: 2,
    },
    {
      event_id: event.id,
      name: "Binyamin Hertz",
      email: "binyamin.hertz@example.com",
      phone: "(305) 555-2003",
      bags_requested: 4,
    },
  ]);

  console.log("Created 3 lettuce waitlist entries");

  // 14. Additional Pickup Locations
  await supabase.from("pickup_locations").insert([
    {
      event_id: event.id,
      name: "Reunion Resort",
      address: "7593 Gathering Dr, Kissimmee, FL 34747",
      notes: "Pickup at the community mailbox area",
    },
    {
      event_id: event.id,
      name: "Windsor Hills Clubhouse",
      address: "7644 Heritage Crossing Way, Kissimmee, FL 34747",
      notes: "Ask front desk for package pickup",
    },
    {
      event_id: event.id,
      name: "Storey Lake Clubhouse",
      address: "4801 Story Lake Blvd, Kissimmee, FL 34746",
      notes: "Available 9am-5pm daily",
    },
  ]);

  console.log("Created 3 additional pickup locations");

  console.log("\nSeed complete!");
  console.log("Summary:");
  console.log(`  - 1 event (Pesach 2026)`);
  console.log(`  - 3 parks with 15 ticket options`);
  console.log(`  - 4 pickup locations`);
  console.log(`  - ${ticketOrders.length} ticket orders`);
  console.log(`  - ${kasheringOrders.length} kashering orders`);
  console.log(`  - ${lettuceOrders.length} lettuce orders`);
  console.log(`  - 3 lettuce waitlist entries`);
  console.log(`  - 200-bag lettuce inventory`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
