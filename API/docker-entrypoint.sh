#!/bin/bash
set -e

echo "Starting API Service..."

# Read password from secret file
export DB_PASSWORD_FILE=${DB_PASSWORD_FILE:-/run/secrets/db_password}
if [ -f "$DB_PASSWORD_FILE" ]; then
  PASSWORD=$(cat "$DB_PASSWORD_FILE" | tr -d '\n\r')
else
  PASSWORD="${DB_PASSWORD:-}"
fi

# Build DATABASE_URL for Prisma
export DATABASE_URL="postgresql://${DB_USER}:${PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Wait for PostgreSQL by attempting connection
echo "Waiting for PostgreSQL..."
TIMEOUT=60
ELAPSED=0
while ! (echo > /dev/tcp/${DB_HOST}/${DB_PORT}) 2>/dev/null; do
  ELAPSED=$((ELAPSED + 2))
  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "PostgreSQL timeout"
    exit 1
  fi
  echo "  PostgreSQL not ready, retrying... ($ELAPSED/$TIMEOUT)"
  sleep 2
done
echo "PostgreSQL is ready"

# Run migrations
echo "Running migrations..."
npx prisma migrate deploy --schema ./prisma/schema.prisma

# Seed database
echo "Seeding database..."
node ./config/bddTest.js

echo "API ready!"
echo "Starting server on port 3001..."
exec node index.js
