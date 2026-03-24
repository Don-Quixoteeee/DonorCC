# ── BUILDER STAGE ─────────────────────────────
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.18.1

# Copy only dependency files first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Ensure public folder exists to avoid Docker checksum errors
RUN mkdir -p public && touch public/.gitkeep

# Copy Prisma schema
COPY prisma ./prisma

# Copy the rest of the source code
COPY . .

# Build Next.js app
RUN pnpm build

# ── RUNNER / PRODUCTION STAGE ─────────────────────────────
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Only copy the necessary files from builder
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Expose the port your app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["pnpm", "start"]
