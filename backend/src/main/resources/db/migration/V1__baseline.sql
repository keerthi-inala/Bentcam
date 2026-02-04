-- Baseline migration for Bentcam
-- Creates a simple table to verify connectivity and migrations
CREATE TABLE IF NOT EXISTS app_info (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_info (name)
SELECT 'bentcam-backend'
WHERE NOT EXISTS (SELECT 1 FROM app_info WHERE name = 'bentcam-backend');
