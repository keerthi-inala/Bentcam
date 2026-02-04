-- Normalize existing role values to lowercase and set default
UPDATE users SET role = LOWER(role);

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
