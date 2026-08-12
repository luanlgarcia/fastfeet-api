import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliveryPhotoProps {
  title: string
  url: string
}

export class DeliveryPhoto extends Entity<DeliveryPhotoProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: DeliveryPhotoProps, id?: UniqueEntityID) {
    const deliveryPhoto = new DeliveryPhoto(props, id)

    return deliveryPhoto
  }
}
