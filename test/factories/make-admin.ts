import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/orders/enterprise/entities/admin'
import { fakerPT_BR as faker } from '@faker-js/faker'

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}
