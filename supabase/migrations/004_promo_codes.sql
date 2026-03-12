-- Promo Codes
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INT NOT NULL,
  min_order_amount INT NOT NULL DEFAULT 0,
  max_uses INT,
  current_uses INT NOT NULL DEFAULT 0,
  applies_to TEXT NOT NULL DEFAULT 'all' CHECK (applies_to IN ('all', 'tickets', 'kashering', 'lettuce')),
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_promo_codes_code ON promo_codes(code);

-- Add promo_code_id to orders
ALTER TABLE orders ADD COLUMN promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN discount INT NOT NULL DEFAULT 0;

-- Row Level Security
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access promo codes" ON promo_codes FOR ALL USING (auth.role() = 'authenticated');

-- Public can read active promo codes (needed for validation)
CREATE POLICY "Public can read active promo codes" ON promo_codes FOR SELECT USING (is_active = true);
