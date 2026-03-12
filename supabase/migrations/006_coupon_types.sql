-- Add new discount types: bogo, free_shipping, flat_per_item
-- Also add max_discount_amount for capping percentage/bogo discounts

ALTER TABLE promo_codes DROP CONSTRAINT IF EXISTS promo_codes_discount_type_check;
ALTER TABLE promo_codes ADD CONSTRAINT promo_codes_discount_type_check
  CHECK (discount_type IN ('percentage', 'fixed', 'bogo', 'free_shipping', 'flat_per_item'));

-- Max discount cap (in cents) — optional, useful for percentage/bogo to limit total discount
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS max_discount_amount INT;
