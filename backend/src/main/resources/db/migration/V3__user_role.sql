-- Add role column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'USER';

-- Optional: ensure existing users have a role
UPDATE users SET role = COALESCE(role, 'USER');
