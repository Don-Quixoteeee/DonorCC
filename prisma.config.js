import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  adapter: process.env.DATABASE_URL, // <-- your Neon URL
})

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  // Remove the `datasource` block entirely
})
