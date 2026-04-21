import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'
import { env } from '../env/index.js'

const url = new URL(env.DATABASE_URL)
const schema = url.searchParams.get('schema') ?? undefined

const adapter = new PrismaPg(
  { connectionString: env.DATABASE_URL },
  { schema },
)

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
