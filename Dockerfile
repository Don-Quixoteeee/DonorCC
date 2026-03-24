# Use Node 20 on Alpine
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@10.18.1 && pnpm install --frozen-lockfile

# Copy Prisma files and source code
COPY prisma ./prisma
COPY . .

# Build Next.js app
RUN pnpm build

# ---------- Runner image ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built Next.js files
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Set environment variable (will be replaced by GitHub Actions secret at runtime)
ENV DATABASE_URL=""

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
