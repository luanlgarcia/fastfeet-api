import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { Addressee } from '../../enterprise/entities/addressee'

interface GetAddresseeUseCaseRequest {
  addresseeId: string
}

type GetAddresseeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    addressee: Addressee
  }
>

@Injectable()
export class GetAddresseeUseCase {
  constructor(private addresseesRepository: AddresseesRepository) {}

  async execute({
    addresseeId,
  }: GetAddresseeUseCaseRequest): Promise<GetAddresseeUseCaseResponse> {
    const addressee = await this.addresseesRepository.findById(addresseeId)

    if (!addressee) {
      return left(new ResourceNotFoundError())
    }

    return right({
      addressee,
    })
  }
}
