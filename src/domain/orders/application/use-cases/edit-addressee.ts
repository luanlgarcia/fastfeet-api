import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { Addressee } from '../../enterprise/entities/addressee'
import { Coordinate } from '../../enterprise/entities/value-objects/coordinate'

interface EditAddresseeUseCaseRequest {
  addresseeId: string
  name: string
  street: string
  number: string
  city: string
  state: string
  postalCode: string
  latitude: number
  longitude: number
}

type EditAddresseeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    addressee: Addressee
  }
>

@Injectable()
export class EditAddresseeUseCase {
  constructor(private addresseesRepository: AddresseesRepository) {}

  async execute({
    addresseeId,
    city,
    name,
    number,
    postalCode,
    state,
    street,
    latitude,
    longitude,
  }: EditAddresseeUseCaseRequest): Promise<EditAddresseeUseCaseResponse> {
    const addressee = await this.addresseesRepository.findById(addresseeId)

    if (!addressee) {
      return left(new ResourceNotFoundError())
    }

    addressee.name = name
    addressee.city = city
    addressee.number = number
    addressee.postalCode = postalCode
    addressee.state = state
    addressee.street = street
    addressee.coordinate = Coordinate.create({ latitude, longitude })

    await this.addresseesRepository.save(addressee)

    return right({
      addressee,
    })
  }
}
