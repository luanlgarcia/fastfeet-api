import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person'

interface EditPasswordDeliveryPersonUseCaseRequest {
  deliveryPersonId: string
  password: string
}

type EditPasswordDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryPerson: DeliveryPerson
  }
>

@Injectable()
export class EditPasswordPasswordDeliveryPersonUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    deliveryPersonId,
    password,
  }: EditPasswordDeliveryPersonUseCaseRequest): Promise<EditPasswordDeliveryPersonUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPersonsRepository.findById(deliveryPersonId)

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    deliveryPerson.password = hashedPassword

    await this.deliveryPersonsRepository.save(deliveryPerson)

    return right({
      deliveryPerson,
    })
  }
}
