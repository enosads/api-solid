import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { env } from '../env/index.js'

let _prisma: PrismaClient | null = null

function getPrismaInstance() {
  if (!_prisma) {
    const databaseUrl = process.env.DATABASE_URL || env.DATABASE_URL
    const adapter = new PrismaPg({ connectionString: databaseUrl })

    _prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'dev' ? ['query'] : [],
    })
  }
  return _prisma
}

export function resetPrisma() {
  if (_prisma) {
    _prisma.$disconnect().catch(() => {})
  }
  _prisma = null
}

export const getPrisma = getPrismaInstance

const handler = {
  get(target: any, prop: string) {
    return (getPrismaInstance() as any)[prop]
  },
}

export const prisma = new Proxy({} as PrismaClient, handler)
