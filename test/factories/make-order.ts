import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/orders/enterprise/entities/order'
import { fakerPT_BR as faker } from '@faker-js/faker'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      name: faker.lorem.word(3),
      addresseeId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return order
}
