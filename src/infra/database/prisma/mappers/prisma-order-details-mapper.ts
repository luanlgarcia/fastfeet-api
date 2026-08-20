import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderDetails } from '@/domain/orders/enterprise/entities/value-objects/order-details'
import { Prisma } from '../generated/client'

type PrismaOrderDetails = Prisma.OrderGetPayload<{
  include: { addressee: true }
}>

export class PrismaOrderDetailsMapper {
  static toDomain(raw: PrismaOrderDetails): OrderDetails {
    return OrderDetails.create({
      orderId: new UniqueEntityID(raw.id),
      name: raw.name,
      status: raw.status,

      addresseeId: new UniqueEntityID(raw.addressee.id),
      addressee: raw.addressee.name,
      street: raw.addressee.street,
      number: raw.addressee.number,
      city: raw.addressee.city,
      state: raw.addressee.state,
      postalCode: raw.addressee.postalCode,

      deliveryPersonId: raw.deliveryPersonId
        ? new UniqueEntityID(raw.deliveryPersonId)
        : null,
      deliveryPhotoId: raw.deliveryPhotoId
        ? new UniqueEntityID(raw.deliveryPhotoId)
        : null,

      postedOn: raw.postedOn,
      pickupDate: raw.pickupDate,
      deliveryDate: raw.deliveryDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
