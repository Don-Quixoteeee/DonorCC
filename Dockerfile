# ── Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.18.1 && pnpm install --frozen-lockfile

# Copy Prisma schema and source code
COPY prisma ./prisma
COPY . .

# Build Next.js app (no Prisma generate yet)
RUN pnpm build

# ── Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built Next.js files
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/src /app/src

# Expose the port your app listens on
EXPOSE 3000

# Start the container with Prisma client generated at runtime
CMD sh -c "pnpm prisma generate && pnpm start" server.js"]
