-- Create database if not exists
SELECT 'CREATE DATABASE biblio' WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'biblio'
) \gexec

-- Connect and grant privileges
\connect biblio
GRANT ALL PRIVILEGES ON DATABASE biblio TO postgres;
