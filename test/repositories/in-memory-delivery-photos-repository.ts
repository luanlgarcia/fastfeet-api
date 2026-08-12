import { DeliveryPhotosRepository } from '@/domain/orders/application/repositories/delivery-photos-repository'
import { DeliveryPhoto } from '@/domain/orders/enterprise/entities/delivery-photo'

export class InMemoryDeliveryPhotosRepository implements DeliveryPhotosRepository {
  public items: DeliveryPhoto[] = []

  async create(photo: DeliveryPhoto) {
    this.items.push(photo)
  }

  async findById(id: string) {
    const deliveryPhoto = this.items.find((item) => item.id.toString() === id)

    if (!deliveryPhoto) {
      return null
    }

    return deliveryPhoto
  }
}
