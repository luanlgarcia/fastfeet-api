import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryPhoto,
  DeliveryPhotoProps,
} from '@/domain/orders/enterprise/entities/delivery-photo'
import { fakerPT_BR as faker } from '@faker-js/faker'

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
