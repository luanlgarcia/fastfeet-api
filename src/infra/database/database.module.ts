import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaDeliveryPersonsRepository } from './prisma/repositories/prisma-delivery-persons-repository'
import { DeliveryPersonsRepository } from '@/domain/orders/application/repositories/delivery-persons-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: DeliveryPersonsRepository,
      useClass: PrismaDeliveryPersonsRepository,
    },
  ],
  exports: [PrismaService, DeliveryPersonsRepository],
})
export class DatabaseModule {}
