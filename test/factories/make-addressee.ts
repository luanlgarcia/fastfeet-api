import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Addressee,
  AddresseeProps,
} from '@/domain/orders/enterprise/entities/addressee'
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
      ...override,
    },
    id,
  )

  return addressee
}
