import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'
import { PrismaClient } from '@prisma/client'

// Prisma client instance for your app code
export const prisma = new PrismaClient({
  adapter: env('DATABASE_URL'), // connect PrismaClient to Neon
})

// Prisma config for CLI (migrations)
export default defineConfig({
  schema: 'prisma/schema.prisma',
  
  datasource: {
    adapter: env('DATABASE_URL'), // migrations read this
  },

  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js', // optional
  },
})
