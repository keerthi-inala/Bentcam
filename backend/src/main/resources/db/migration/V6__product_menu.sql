-- Add menu (category slug) to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS menu VARCHAR(100) NOT NULL DEFAULT 'uncategorized';
