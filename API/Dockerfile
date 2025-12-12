# ===== Build Stage =====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Generate Prisma Client
RUN npx prisma generate --schema ./prisma/schema.prisma

# ===== Runtime Stage =====
FROM node:20-alpine

WORKDIR /app

# Install bash for scripts
RUN apk add --no-cache bash

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Copy initialization script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=5 \
  CMD node -e "require('http').get('http://localhost:3001/api/v1/books', (r) => {if (r.statusCode >= 400) throw new Error(r.statusCode)})"

# Run entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["start"]
