import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'

interface FetchDeliveryPersonOrdersUseCaseRequest {
  deliveryPersonId: string
  page: number
}

type FetchDeliveryPersonOrdersUseCaseResponse = Either<
  null,
  {
    orders: OrderDetails[]
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
