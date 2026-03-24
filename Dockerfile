
# -------------------------
# Builder stage
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm install -g pnpm@10.18.1 && \
    pnpm install --frozen-lockfile

COPY . .

# ❌ No prisma generate here
RUN pnpm build


# -------------------------
# Runtime stage
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm@10.18.1

# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma
COPY --from=builder /app/prisma ./prisma

# Copy config + package
COPY --from=builder /app/prisma.config.js ./prisma.config.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# ✅ Runtime Prisma
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma generate && node server.js"]& node server.js"]
