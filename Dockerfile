
# -------------------------
# Builder stage
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first (for caching)
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema
COPY prisma ./prisma

# Install pnpm + dependencies
RUN npm install -g pnpm@10.18.1 && \
    pnpm install --frozen-lockfile

# Copy rest of the app
COPY . .

# ❌ REMOVED prisma generate from build stage
# RUN pnpm prisma generate   <-- DELETE THIS

# Build Next.js app
RUN pnpm build


# -------------------------
# Runtime stage
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm in runtime (needed for prisma commands)
RUN npm install -g pnpm@10.18.1

# Copy built Next.js app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/generated ./prisma/generated
COPY --from=builder /app/src/generated ./src/generated

# Copy Prisma config (important for your setup)
COPY --from=builder /app/prisma.config.js ./prisma.config.js

# Copy package.json
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# ✅ Prisma runs at runtime (when DATABASE_URL exists)
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma generate && node server.js"]
