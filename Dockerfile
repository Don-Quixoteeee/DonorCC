# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.18.1 && pnpm install --frozen-lockfile

COPY prisma ./prisma
COPY . .

RUN pnpm build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next /app/.next

# Only copy public if exists
COPY --from=builder /app/public ./public || true

COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/src /app/src

EXPOSE 3000

CMD sh -c "pnpm prisma generate && pnpm start"ver.js"]
