import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchDeliveryPersonOrdersUseCaseRequest {
  deliveryPersonId: string
  page: number
}

type FetchDeliveryPersonOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchDeliveryPersonOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliveryPersonId,
    page,
  }: FetchDeliveryPersonOrdersUseCaseRequest): Promise<FetchDeliveryPersonOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByDeliveryPersonId(
      deliveryPersonId,
      { page },
    )

    return right({
      orders,
    })
  }
}
