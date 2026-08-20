import { Order } from '@/domain/orders/enterprise/entities/order'
import { Prisma, Order as PrismaOrder } from '../generated/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        addresseeId: new UniqueEntityID(raw.addresseeId),
        name: raw.name,
        createdAt: raw.createdAt,
        deliveryDate: raw.deliveryDate,
        deliveryPersonId: raw.deliveryPersonId
          ? new UniqueEntityID(raw.deliveryPersonId)
          : null,
        deliveryPhotoId: raw.deliveryPhotoId
          ? new UniqueEntityID(raw.deliveryPhotoId)
          : null,
        pickupDate: raw.pickupDate,
        postedOn: raw.postedOn,
        status: raw.status,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      name: order.name,
      addresseeId: order.addresseeId.toString(),
      deliveryPersonId: order.deliveryPersonId?.toString() ?? null,
      deliveryPhotoId: order.deliveryPhotoId?.toString() ?? null,
      status: order.status,
      postedOn: order.postedOn,
      pickupDate: order.pickupDate,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
