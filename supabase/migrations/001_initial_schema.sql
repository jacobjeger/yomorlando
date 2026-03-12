-- YoM Orlando Database Schema
-- All prices stored as integer cents

-- Enums
CREATE TYPE holiday_type AS ENUM ('pesach', 'succos', 'winter_break');
CREATE TYPE park_name AS ENUM ('universal', 'seaworld', 'disney', 'other');
CREATE TYPE order_type AS ENUM ('tickets', 'kashering', 'lettuce');
CREATE TYPE fulfillment_status AS ENUM ('pending', 'fulfilled', 'shipped', 'picked_up');
CREATE TYPE age_category AS ENUM ('child', 'adult');

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  holiday_type holiday_type NOT NULL,
  year INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  order_open TIMESTAMPTZ NOT NULL,
  order_close TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_holiday_type ON events(holiday_type);
CREATE INDEX idx_events_published ON events(is_published);

-- Parks
CREATE TABLE parks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  park_name park_name NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_parks_event_id ON parks(event_id);

-- Ticket Options
CREATE TABLE ticket_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
  option_code VARCHAR(10) NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_child INT NOT NULL DEFAULT 0,
  price_adult INT NOT NULL DEFAULT 0,
  includes_epic BOOLEAN NOT NULL DEFAULT false,
  date_restriction_start DATE,
  date_restriction_end DATE,
  child_age_min INT NOT NULL DEFAULT 3,
  child_age_max INT,
  adult_age_min INT NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_ticket_options_park_id ON ticket_options(park_id);

-- Event Date Ranges
CREATE TABLE event_date_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id UUID NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  range_start DATE NOT NULL,
  range_end DATE NOT NULL
);

CREATE INDEX idx_event_date_ranges_park_id ON event_date_ranges(park_id);

-- Pickup Locations
CREATE TABLE pickup_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_pickup_locations_event_id ON pickup_locations(event_id);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  order_type order_type NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address JSONB NOT NULL DEFAULT '{}',
  stripe_payment_intent_id TEXT,
  subtotal INT NOT NULL DEFAULT 0,
  surcharge INT NOT NULL DEFAULT 0,
  donation INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  fulfillment_status fulfillment_status NOT NULL DEFAULT 'pending',
  how_heard TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_orders_order_type ON orders(order_type);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_option_id UUID REFERENCES ticket_options(id) ON DELETE SET NULL,
  item_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 1,
  unit_price INT NOT NULL DEFAULT 0,
  subtotal INT NOT NULL DEFAULT 0,
  age_category age_category,
  visit_date DATE,
  delivery_method TEXT
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Kashering Details
CREATE TABLE kashering_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  villa_address JSONB NOT NULL DEFAULT '{}',
  development TEXT NOT NULL,
  access_day DATE NOT NULL,
  num_bedrooms INT NOT NULL DEFAULT 0,
  num_houses INT NOT NULL DEFAULT 1,
  shul_membership BOOLEAN NOT NULL DEFAULT false
);

-- Lettuce Inventory
CREATE TABLE lettuce_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  max_bags INT NOT NULL DEFAULT 0,
  is_waitlist_active BOOLEAN NOT NULL DEFAULT false
);

-- Lettuce Waitlist
CREATE TABLE lettuce_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  bags_requested INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lettuce_waitlist_event_id ON lettuce_waitlist(event_id);

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE parks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_date_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kashering_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE lettuce_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE lettuce_waitlist ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog data
CREATE POLICY "Public can read published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read parks" ON parks FOR SELECT USING (true);
CREATE POLICY "Public can read ticket options" ON ticket_options FOR SELECT USING (true);
CREATE POLICY "Public can read date ranges" ON event_date_ranges FOR SELECT USING (true);
CREATE POLICY "Public can read pickup locations" ON pickup_locations FOR SELECT USING (true);
CREATE POLICY "Public can read lettuce inventory" ON lettuce_inventory FOR SELECT USING (true);

-- Public insert for orders (customers placing orders)
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create kashering details" ON kashering_details FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can join waitlist" ON lettuce_waitlist FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin full access events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access parks" ON parks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access ticket options" ON ticket_options FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access date ranges" ON event_date_ranges FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access pickup locations" ON pickup_locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access order items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access kashering" ON kashering_details FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access lettuce inventory" ON lettuce_inventory FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access waitlist" ON lettuce_waitlist FOR ALL USING (auth.role() = 'authenticated');
