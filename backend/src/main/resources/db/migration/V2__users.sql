-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NULL
);

-- Ensure email uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);
