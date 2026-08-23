import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderDetails } from '@/domain/orders/enterprise/entities/value-objects/order-details'
import { Prisma } from '../generated/client'
import { OrderStatus } from '@/domain/orders/enterprise/entities/order'

export interface OrderDetailsCache {
  orderId: string
  name: string
  status: OrderStatus
  addresseeId: string
  addressee: string
  street: string
  number: string
  city: string
  state: string
  postalCode: string
  deliveryPersonId: string | null
  deliveryPhotoId: string | null
  postedOn: string | null
  pickupDate: string | null
  deliveryDate: string | null
  createdAt: string
  updatedAt: string | null
}

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

  static toCache(orderDetails: OrderDetails): OrderDetailsCache {
    return {
      orderId: orderDetails.orderId.toString(),
      name: orderDetails.name,
      status: orderDetails.status,

      addresseeId: orderDetails.addresseeId.toString(),
      addressee: orderDetails.addressee,
      street: orderDetails.street,
      number: orderDetails.number,
      city: orderDetails.city,
      state: orderDetails.state,
      postalCode: orderDetails.postalCode,

      deliveryPersonId: orderDetails.deliveryPersonId?.toString() ?? null,
      deliveryPhotoId: orderDetails.deliveryPhotoId?.toString() ?? null,

      postedOn: orderDetails.postedOn?.toISOString() ?? null,
      pickupDate: orderDetails.pickupDate?.toISOString() ?? null,
      deliveryDate: orderDetails.deliveryDate?.toISOString() ?? null,
      createdAt: orderDetails.createdAt.toISOString(),
      updatedAt: orderDetails.updatedAt?.toISOString() ?? null,
    }
  }

  static fromCache(raw: OrderDetailsCache): OrderDetails {
    return OrderDetails.create({
      orderId: new UniqueEntityID(raw.orderId),
      name: raw.name,
      status: raw.status,

      addresseeId: new UniqueEntityID(raw.addresseeId),
      addressee: raw.addressee,
      street: raw.street,
      number: raw.number,
      city: raw.city,
      state: raw.state,
      postalCode: raw.postalCode,

      deliveryPersonId: raw.deliveryPersonId
        ? new UniqueEntityID(raw.deliveryPersonId)
        : null,
      deliveryPhotoId: raw.deliveryPhotoId
        ? new UniqueEntityID(raw.deliveryPhotoId)
        : null,

      postedOn: raw.postedOn ? new Date(raw.postedOn) : null,
      pickupDate: raw.pickupDate ? new Date(raw.pickupDate) : null,
      deliveryDate: raw.deliveryDate ? new Date(raw.deliveryDate) : null,
      createdAt: new Date(raw.createdAt),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
    })
  }
}
