import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/environments'
import { prisma } from '@/lib/prisma'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

async function cleanOrphanedSchemas() {
  const schemas = await prisma.$queryRaw<{ schema_name: string }[]>`
    SELECT schema_name FROM information_schema.schemata
    WHERE schema_name ~ '^[0-9a-f]{8}-[0-9a-f]{4}'
  `
  for (const { schema_name } of schemas) {
    if (UUID_REGEX.test(schema_name)) {
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schema_name}" CASCADE`,
      )
    }
  }
}

export default (<Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    await cleanOrphanedSchemas()

    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)
    console.log(databaseUrl)
    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
})
