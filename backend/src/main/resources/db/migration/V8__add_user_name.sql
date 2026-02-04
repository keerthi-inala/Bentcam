-- Add 'name' column to users for full name
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
