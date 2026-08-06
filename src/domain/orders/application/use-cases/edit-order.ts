import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditOrderUseCaseRequest {
  orderId: string
  addresseeId: string
  name: string
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private addresseesRepository: AddresseesRepository,
  ) {}

  async execute({
    orderId,
    name,
    addresseeId,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const [order, addressee] = await Promise.all([
      this.ordersRepository.findById(orderId),
      this.addresseesRepository.findById(addresseeId),
    ])

    if (!order || !addressee) {
      return left(new ResourceNotFoundError())
    }

    order.name = name
    order.addresseeId = new UniqueEntityID(addresseeId)

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
