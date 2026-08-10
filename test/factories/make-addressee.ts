import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Addressee,
  AddresseeProps,
} from '@/domain/orders/enterprise/entities/addressee'
import { Coordinate } from '@/domain/orders/enterprise/entities/value-objects/coordinate'
import { fakerPT_BR as faker } from '@faker-js/faker'

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
