# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.18.1 && pnpm install --frozen-lockfile

# Ensure public exists
RUN mkdir -p public

COPY prisma ./prisma
COPY . .

RUN pnpm build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public   # now guaranteed to exist
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD sh -c "pnpm prisma generate && pnpm start"ver.js"]
