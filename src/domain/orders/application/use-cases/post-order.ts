import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { OrderWithoutAddresseeError } from './errors/order-without-addressee-error'
import { InvalidOrderStatusError } from './errors/invalid-order-status-error'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { OrderNotFoundError } from './errors/order-not-found-error'

interface PostOrderUseCaseRequest {
  orderId: string
}

type PostOrderUseCaseResponse = Either<
  OrderNotFoundError | OrderWithoutAddresseeError | InvalidOrderStatusError,
  {
    order: Order
  }
>

@Injectable()
export class PostOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private addresseesRepository: AddresseesRepository,
  ) {}

  async execute({
    orderId,
  }: PostOrderUseCaseRequest): Promise<PostOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError(orderId))
    }

    if (order.status !== 'PENDING') {
      return left(new InvalidOrderStatusError(order.status, 'PENDING'))
    }

    const addressee = await this.addresseesRepository.findById(
      order.addresseeId.toString(),
    )

    if (!addressee) {
      return left(new OrderWithoutAddresseeError(order.name))
    }

    order.status = 'WAITING'
    order.postedOn = new Date()

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
