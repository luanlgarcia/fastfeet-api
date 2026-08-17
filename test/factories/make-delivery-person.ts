import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from '@/domain/orders/enterprise/entities/delivery-person'
import { PrismaDeliveryPersonMapper } from '@/infra/database/prisma/mappers/prisma-delivery-person-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliveryPerson(
  override: Partial<DeliveryPersonProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryPerson = DeliveryPerson.create(
    {
      name: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryPerson
}

@Injectable()
export class DeliveryPersonFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryPerson(
    data: Partial<DeliveryPersonProps> = {},
  ): Promise<DeliveryPerson> {
    const deliveryPerson = makeDeliveryPerson(data)

    await this.prisma.user.create({
      data: PrismaDeliveryPersonMapper.toPrisma(deliveryPerson),
    })

    return deliveryPerson
  }
}
