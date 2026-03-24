import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  adapter: env('DATABASE_URL'), // Prisma client connects to Neon
})

export default defineConfig({
  schema: 'prisma/schema.prisma',

  datasource: {
    adapter: env('DATABASE_URL'), // Migrations also use this
  },

  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js', // optional
  },
})
