import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person'

interface GetDeliveryPersonUseCaseRequest {
  deliveryPersonId: string
}

type GetDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryPerson: DeliveryPerson
  }
>

@Injectable()
export class GetDeliveryPersonUseCase {
  constructor(private deliveryPersonRepository: DeliveryPersonsRepository) {}

  async execute({
    deliveryPersonId,
  }: GetDeliveryPersonUseCaseRequest): Promise<GetDeliveryPersonUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }

    return right({
      deliveryPerson,
    })
  }
}
