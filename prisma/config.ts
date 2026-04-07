import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  PrismaClient: typeof PrismaClient
}

const prisma = globalForPrisma.PrismaClient || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

export default prisma
