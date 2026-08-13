import { DeliveryPerson } from '@/domain/orders/enterprise/entities/delivery-person'
import { Prisma, User as PrismaUser } from '../generated/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaDeliveryPersonMapper {
  static toDomain(raw: PrismaUser): DeliveryPerson {
    return DeliveryPerson.create(
      {
        cpf: raw.cpf,
        name: raw.name,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    deliveryPerson: DeliveryPerson,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryPerson.id.toString(),
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
      password: deliveryPerson.password,
      role: 'DELIVERY_PERSON',
      createdAt: deliveryPerson.createdAt,
      updatedAt: deliveryPerson.updatedAt,
    }
  }
}
