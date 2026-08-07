import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { InvalidOrderStatusError } from './errors/invalid-order-status-error'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { OrderNotFoundError } from './errors/order-not-found-error'
import { DeliveryPersonNotFoundError } from './errors/delivery-person-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface ReturnOrderUseCaseRequest {
  orderId: string
  deliveryPersonId: string
}

type ReturnOrderUseCaseResponse = Either<
  | OrderNotFoundError
  | InvalidOrderStatusError
  | DeliveryPersonNotFoundError
  | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class ReturnOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryPersonRepository: DeliveryPersonsRepository,
  ) {}

  async execute({
    orderId,
    deliveryPersonId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError(orderId))
    }

    if (order.status !== 'PICKED_UP') {
      return left(new InvalidOrderStatusError(order.status, 'PICKED_UP'))
    }

    if (deliveryPersonId !== order.deliveryPersonId?.toString()) {
      return left(new NotAllowedError())
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new DeliveryPersonNotFoundError(deliveryPersonId))
    }

    order.status = 'RETURNED'

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
