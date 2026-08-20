import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryPhoto,
  DeliveryPhotoProps,
} from '@/domain/orders/enterprise/entities/delivery-photo'
import { PrismaDeliveryPhotoMapper } from '@/infra/database/prisma/mappers/prisma-delivery-photo-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliveryPhoto(
  override: Partial<DeliveryPhotoProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryPhoto = DeliveryPhoto.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return deliveryPhoto
}

@Injectable()
export class DeliveryPhotoFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryPhoto(
    data: Partial<DeliveryPhotoProps> = {},
  ): Promise<DeliveryPhoto> {
    const deliveryPhoto = makeDeliveryPhoto(data)

    await this.prisma.deliveryPhoto.create({
      data: PrismaDeliveryPhotoMapper.toPrisma(deliveryPhoto),
    })

    return deliveryPhoto
  }
}
