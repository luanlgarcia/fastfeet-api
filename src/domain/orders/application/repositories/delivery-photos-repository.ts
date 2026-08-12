import { DeliveryPhoto } from '../../enterprise/entities/delivery-photo'

export abstract class DeliveryPhotosRepository {
  abstract create(deliveryPhoto: DeliveryPhoto): Promise<void>
  abstract findById(id: string): Promise<DeliveryPhoto | null>
}
