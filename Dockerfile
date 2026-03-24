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

# Generate Prisma client (NO DB needed)
RUN pnpm prisma generate

# Build Next.js app
RUN pnpm build


# -------------------------
# Runtime stage
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built Next.js app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/generated ./prisma/generated
COPY --from=builder /app/src/generated ./src/generated

# Copy Prisma config
COPY --from=builder /app/prisma.config.js ./prisma.config.js

# Copy package.json (optional)
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# ✅ IMPORTANT: Run Prisma at runtime (env vars available here)
CMD ["sh", "-c", "pnpm prisma generate && node server.js"]
