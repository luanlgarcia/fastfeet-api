import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderStatus } from '../order'
import { ValueObject } from '@/core/entities/value-object'

export interface OrderDetailsProps {
  orderId: UniqueEntityID
  name: string
  status: OrderStatus

  addresseeId: UniqueEntityID
  addressee: string
  street: string
  number: string
  city: string
  state: string
  postalCode: string

  deliveryPersonId?: UniqueEntityID | null
  deliveryPhotoId?: UniqueEntityID | null

  postedOn?: Date | null
  pickupDate?: Date | null
  deliveryDate?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
  get orderId() {
    return this.props.orderId
  }

  get name() {
    return this.props.name
  }

  get status() {
    return this.props.status
  }

  get addresseeId() {
    return this.props.addresseeId
  }

  get addressee() {
    return this.props.addressee
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get postalCode() {
    return this.props.postalCode
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId
  }

  get deliveryPhotoId() {
    return this.props.deliveryPhotoId
  }

  get postedOn() {
    return this.props.postedOn
  }

  get pickupDate() {
    return this.props.pickupDate
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: OrderDetailsProps) {
    return new OrderDetails(props)
  }
}
