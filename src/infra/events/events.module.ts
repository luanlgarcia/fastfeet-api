import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderStatusChanged } from '@/domain/notification/application/subscribers/on-order-status-changed'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [OnOrderStatusChanged, SendNotificationUseCase],
})
export class EventsModule {}
