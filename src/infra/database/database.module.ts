import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaDeliveryPersonsRepository } from './prisma/repositories/prisma-delivery-persons-repository'
import { DeliveryPersonsRepository } from '@/domain/orders/application/repositories/delivery-persons-repository'
import { AddresseesRepository } from '@/domain/orders/application/repositories/addressees-repository'
import { PrismaAddresseesRepository } from './prisma/repositories/prisma-addressees-repository'
import { OrdersRepository } from '@/domain/orders/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { DeliveryPhotosRepository } from '@/domain/orders/application/repositories/delivery-photos-repository'
import { PrismaDeliveryPhotosRepository } from './prisma/repositories/prisma-delivery-photo-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notification-repository'
import { AdminsRepository } from '@/domain/orders/application/repositories/admins-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
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
    {
      provide: DeliveryPhotosRepository,
      useClass: PrismaDeliveryPhotosRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    DeliveryPersonsRepository,
    AddresseesRepository,
    OrdersRepository,
    DeliveryPhotosRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
