import { DomainEvents } from '@/core/events/domain-events'
import { PrismaClient } from '@/infra/database/prisma/generated/client'
import { envSchema } from '@/infra/env/env'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()
const databaseURL = generateUniqueDatabaseURL(schemaId)

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    { connectionString: databaseURL },
    { schema: schemaId },
  ),
})

beforeAll(async () => {
  process.env.DATABASE_URL = databaseURL
  process.env.DATABASE_SCHEMA = schemaId

  DomainEvents.shouldRun = false

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
