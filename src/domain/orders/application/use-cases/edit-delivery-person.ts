import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person'

interface EditDeliveryPersonUseCaseRequest {
  deliveryPersonId: string
  name: string
}

type EditDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryPerson: DeliveryPerson
  }
>

@Injectable()
export class EditDeliveryPersonUseCase {
  constructor(private deliveryPersonsRepository: DeliveryPersonsRepository) {}

  async execute({
    deliveryPersonId,
    name,
  }: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPersonsRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }

    deliveryPerson.name = name

    await this.deliveryPersonsRepository.save(deliveryPerson)

    return right({
      deliveryPerson,
    })
  }
}
