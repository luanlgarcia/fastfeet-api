import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Addressee,
  AddresseeProps,
} from '@/domain/orders/enterprise/entities/addressee'
import { Coordinate } from '@/domain/orders/enterprise/entities/value-objects/coordinate'
import { PrismaAddresseeMapper } from '@/infra/database/prisma/mappers/prisma-addressee-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAddressee(
  override: Partial<AddresseeProps> = {},
  id?: UniqueEntityID,
) {
  const addressee = Addressee.create(
    {
      name: faker.person.fullName(),
      city: faker.location.city(),
      number: faker.location.buildingNumber(),
      state: faker.location.state({ abbreviated: true }),
      street: faker.location.street(),
      postalCode: faker.location.zipCode(),
      coordinate: Coordinate.create({
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      }),
      ...override,
    },
    id,
  )

  return addressee
}

@Injectable()
export class AddresseeFactory {
  constructor(private prisma: PrismaService) {}

  async makeAddressee(data: Partial<AddresseeProps> = {}): Promise<Addressee> {
    const addressee = makeAddressee(data)

    await this.prisma.addressee.create({
      data: PrismaAddresseeMapper.toPrisma(addressee),
    })

    return addressee
  }
}
