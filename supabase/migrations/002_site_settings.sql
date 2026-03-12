-- Site Settings table for admin-configurable values
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin full access settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed with current hardcoded defaults
INSERT INTO site_settings (key, value) VALUES
  ('kashering_pricing', '{"base_price": 47500, "solara_discount": 7500, "ring_set_price": 6000, "counter_roll_price": 3500}'),
  ('lettuce_pricing', '{"price_per_bag": 2500, "delivery_fee": 3000}'),
  ('surcharge_rate', '{"rate": 0.03}'),
  ('how_heard_options', '["Community WhatsApp chats", "CHAVI CHASE", "SY Classifieds", "Yeshiva World News", "School Flyer Handouts", "MKY Status", "My Jewish Florida", "Between Carpools", "Mommy Deals", "Jewish Echo", "Word of Mouth", "Other"]'),
  ('ticket_delivery_options', '[{"value": "whatsapp", "label": "WhatsApp (Disney only, free)", "fee": 0}, {"value": "ship_3day", "label": "Ship — 3 day ($25)", "fee": 2500}, {"value": "ship_overnight", "label": "Ship — Overnight ($35)", "fee": 3500}, {"value": "pickup", "label": "Pickup", "fee": 0}]'),
  ('kashering_developments', '["Solara", "Windsor Westside", "Windsor Island", "Solterra", "Encore", "Reunion", "Champions Gate", "Eden Gardens", "Villatel Village", "Other"]'),
  ('lettuce_developments', '["Solara", "Solterra", "Villatel Village", "Champions Gate", "Reunion/Bears Den", "Encore", "Storey Lake", "Windsor Island", "Eden Gardens"]'),
  ('donation_presets', '[18, 36, 54, 100]');
