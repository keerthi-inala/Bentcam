-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(200) NOT NULL,
    part         VARCHAR(100) NOT NULL UNIQUE,
    price        NUMERIC(12,2) NOT NULL,
    description  VARCHAR(2000),
    image_url    VARCHAR(500),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NULL
);
