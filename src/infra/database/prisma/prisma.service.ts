import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter: new PrismaPg(
        {
          connectionString: process.env.DATABASE_URL,
          options: process.env.DATABASE_SCHEMA
            ? `-c search_path="${process.env.DATABASE_SCHEMA}"`
            : undefined,
        },
        { schema: process.env.DATABASE_SCHEMA },
      ),
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
