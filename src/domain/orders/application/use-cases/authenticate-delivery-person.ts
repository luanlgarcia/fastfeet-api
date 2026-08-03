import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DeliveryPersonsRepository } from '../repositories/delivery-persons-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateDeliveryPersonUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliveryPersonUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateDeliveryPersonUseCase {
  constructor(
    private deliveryPersonsRepository: DeliveryPersonsRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliveryPersonUseCaseRequest): Promise<AuthenticateDeliveryPersonUseCaseResponse> {
    const deliveryPerson = await this.deliveryPersonsRepository.findByCpf(cpf)

    if (!deliveryPerson) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      deliveryPerson.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryPerson.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
