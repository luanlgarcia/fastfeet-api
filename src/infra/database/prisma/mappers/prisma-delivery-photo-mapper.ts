import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryPhoto } from '@/domain/orders/enterprise/entities/delivery-photo'
import {
  Prisma,
  DeliveryPhoto as PrismaDeliveryPhoto,
} from '../generated/client'

export class PrismaDeliveryPhotoMapper {
  static toDomain(raw: PrismaDeliveryPhoto): DeliveryPhoto {
    return DeliveryPhoto.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    deliveryPhoto: DeliveryPhoto,
  ): Prisma.DeliveryPhotoUncheckedCreateInput {
    return {
      id: deliveryPhoto.id.toString(),
      title: deliveryPhoto.title,
      url: deliveryPhoto.url,
    }
  }
}
