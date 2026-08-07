import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { InvalidOrderStatusError } from './errors/invalid-order-status-error'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderNotFoundError } from './errors/order-not-found-error'
import { DeliveryPersonNotFoundError } from './errors/delivery-person-not-found-error'

interface PickUpOrderUseCaseRequest {
  orderId: string
  deliveryPersonId: string
}

type PickUpOrderUseCaseResponse = Either<
  OrderNotFoundError | InvalidOrderStatusError | DeliveryPersonNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class PickUpOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryPersonRepository: DeliveryPersonsRepository,
  ) {}

  async execute({
    orderId,
    deliveryPersonId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError(orderId))
    }

    if (order.status !== 'WAITING') {
      return left(new InvalidOrderStatusError(order.status, 'WAITING'))
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new DeliveryPersonNotFoundError(deliveryPersonId))
    }

    order.status = 'PICKED_UP'
    order.pickupDate = new Date()
    order.deliveryPersonId = new UniqueEntityID(deliveryPersonId)

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
