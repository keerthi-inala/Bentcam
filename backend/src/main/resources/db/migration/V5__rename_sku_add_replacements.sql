-- Rename SKU to Part (safe if column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'sku'
    ) THEN
        EXECUTE 'ALTER TABLE products RENAME COLUMN sku TO part';
    END IF;
END$$;

-- Create replacements join table
CREATE TABLE IF NOT EXISTS product_replacements (
    product_id     BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    replacement_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, replacement_id)
);
