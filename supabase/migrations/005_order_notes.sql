-- Order Notes (admin internal notes)
CREATE TABLE order_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_notes_order_id ON order_notes(order_id);

ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access order notes" ON order_notes FOR ALL USING (auth.role() = 'authenticated');
