import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AddresseesRepository } from '../repositories/addressees-repository'
import { Addressee } from '../../enterprise/entities/addressee'
import { Coordinate } from '../../enterprise/entities/value-objects/coordinate'

interface CreateAddresseeUseCaseRequest {
  name: string
  street: string
  number: string
  city: string
  state: string
  postalCode: string
  latitude: number
  longitude: number
}

type CreateAddresseeUseCaseResponse = Either<
  null,
  {
    addressee: Addressee
  }
>

@Injectable()
export class CreateAddresseeUseCase {
  constructor(private addresseesRepository: AddresseesRepository) {}

  async execute({
    name,
    street,
    city,
    number,
    postalCode,
    state,
    latitude,
    longitude,
  }: CreateAddresseeUseCaseRequest): Promise<CreateAddresseeUseCaseResponse> {
    const addressee = await Addressee.create({
      name,
      state,
      city,
      number,
      postalCode,
      street,
      coordinate: Coordinate.create({ latitude, longitude }),
    })

    await this.addresseesRepository.create(addressee)

    return right({
      addressee,
    })
  }
}
