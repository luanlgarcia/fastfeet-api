import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'

interface DeleteDeliveryPersonUseCaseRequest {
  deliveryPersonId: string
}

type DeleteDeliveryPersonUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteDeliveryPersonUseCase {
  constructor(private deliveryPersonRepository: DeliveryPersonsRepository) {}

  async execute({
    deliveryPersonId,
  }: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }

    await this.deliveryPersonRepository.delete(deliveryPerson)

    return right(null)
  }
}
