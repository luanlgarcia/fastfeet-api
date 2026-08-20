import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaDeliveryPersonsRepository } from './prisma/repositories/prisma-delivery-persons-repository'
import { DeliveryPersonsRepository } from '@/domain/orders/application/repositories/delivery-persons-repository'
import { AddresseesRepository } from '@/domain/orders/application/repositories/addressees-repository'
import { PrismaAddresseesRepository } from './prisma/repositories/prisma-addressees-repository'
import { OrdersRepository } from '@/domain/orders/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: DeliveryPersonsRepository,
      useClass: PrismaDeliveryPersonsRepository,
    },
    {
      provide: AddresseesRepository,
      useClass: PrismaAddresseesRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
  ],
  exports: [
    PrismaService,
    DeliveryPersonsRepository,
    AddresseesRepository,
    OrdersRepository,
  ],
})
export class DatabaseModule {}
