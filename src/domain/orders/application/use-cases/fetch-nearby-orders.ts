import { Either, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { Coordinate } from '../../enterprise/entities/value-objects/coordinate'
import { Injectable } from '@nestjs/common'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'

interface FetchNearbyOrdersUseCaseRequest {
  latitude: number
  longitude: number
  page: number
}

type FetchNearbyOrdersUseCaseResponse = Either<
  null,
  {
    orders: OrderDetails[]
  }
>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    latitude,
    longitude,
    page,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyNearby(
      Coordinate.create({ latitude, longitude }),
      { page },
    )

    return right({ orders })
  }
}
