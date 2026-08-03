import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AddresseesRepository } from '../repositories/addressees-repository'

interface DeleteAddresseeUseCaseRequest {
  addresseeId: string
}

type DeleteAddresseeUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteAddresseeUseCase {
  constructor(private addresseesRepository: AddresseesRepository) {}

  async execute({
    addresseeId,
  }: DeleteAddresseeUseCaseRequest): Promise<DeleteAddresseeUseCaseResponse> {
    const addressee = await this.addresseesRepository.findById(addresseeId)

    if (!addressee) {
      return left(new ResourceNotFoundError())
    }

    await this.addresseesRepository.delete(addressee)

    return right(null)
  }
}
