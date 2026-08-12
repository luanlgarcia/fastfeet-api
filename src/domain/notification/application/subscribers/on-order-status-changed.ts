import { EventHandler } from '@/core/events/event-handler'
import { Injectable } from '@nestjs/common'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderStatusChangedEvent } from '@/domain/orders/enterprise/events/order-status-changed-event'
import { AddresseesRepository } from '@/domain/orders/application/repositories/addressees-repository'
import { OrderStatus } from '@/domain/orders/enterprise/entities/order'

const ORDER_STATUS_MESSAGES: Record<OrderStatus, string> = {
  PENDING: 'Sua encomenda foi cadastrada.',
  WAITING: 'Sua encomenda está disponível para retirada.',
  PICKED_UP: 'Sua encomenda saiu para entrega.',
  DELIVERED: 'Sua encomenda foi entregue.',
  RETURNED: 'Sua encomenda foi devolvida.',
}

@Injectable()
export class OnOrderStatusChanged implements EventHandler {
  constructor(
    private addresseesRepository: AddresseesRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderStatusNotification.bind(this),
      OrderStatusChangedEvent.name,
    )
  }

  private async sendOrderStatusNotification({
    order,
  }: OrderStatusChangedEvent) {
    const addressee = await this.addresseesRepository.findById(
      order.addresseeId.toString(),
    )

    if (addressee) {
      await this.sendNotification.execute({
        recipientId: addressee.id.toString(),
        title: `Atualização da encomenda "${order.name}"`,
        content: ORDER_STATUS_MESSAGES[order.status],
      })
    }
  }
}
