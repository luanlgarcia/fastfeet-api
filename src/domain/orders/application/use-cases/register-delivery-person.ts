import { Either, left, right } from '@/core/either'

import { Injectable } from '@nestjs/common'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists-error'
import { DeliveryPerson } from '../../enterprise/entities/delivery-person'

interface RegisterDeliveryPersonUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterDeliveryPersonUseCaseResponse = Either<
  DeliveryPersonAlreadyExistsError,
  {
    deliveryPerson: DeliveryPerson
  }
>

@Injectable()
export class RegisterDeliveryPersonUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterDeliveryPersonUseCaseRequest): Promise<RegisterDeliveryPersonUseCaseResponse> {
    const deliveryPersonWithSameCpf =
      await this.deliveryPersonsRepository.findByCpf(cpf)

    if (deliveryPersonWithSameCpf) {
      return left(new DeliveryPersonAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryPerson = DeliveryPerson.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.deliveryPersonsRepository.create(deliveryPerson)

    return right({
      deliveryPerson,
    })
  }
}
