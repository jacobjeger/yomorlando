-- FAQ Items
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_faq_items_display_order ON faq_items(display_order);
CREATE INDEX idx_faq_items_published ON faq_items(is_published);

-- Row Level Security
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Public can read published FAQ items
CREATE POLICY "Public can read published faqs" ON faq_items FOR SELECT USING (is_published = true);

-- Admin full access
CREATE POLICY "Admin full access faqs" ON faq_items FOR ALL USING (auth.role() = 'authenticated');
