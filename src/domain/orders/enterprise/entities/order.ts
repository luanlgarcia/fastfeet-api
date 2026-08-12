import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { OrderStatusChangedEvent } from '../events/order-status-changed-event'

export type OrderStatus =
  'PENDING' | 'WAITING' | 'PICKED_UP' | 'DELIVERED' | 'RETURNED'

export interface OrderProps {
  name: string
  addresseeId: UniqueEntityID
  deliveryPersonId?: UniqueEntityID | null
  status: OrderStatus
  postedOn?: Date | null
  pickupDate?: Date | null
  deliveryDate?: Date | null
  deliveryPhotoId?: UniqueEntityID | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name

    this.touch()
  }

  get addresseeId() {
    return this.props.addresseeId
  }

  set addresseeId(addresseeId: UniqueEntityID) {
    this.props.addresseeId = addresseeId

    this.touch()
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId
  }

  set deliveryPersonId(deliveryPersonId: UniqueEntityID | undefined | null) {
    if (deliveryPersonId === undefined || deliveryPersonId === null) {
      return
    }

    this.props.deliveryPersonId = deliveryPersonId

    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: OrderStatus) {
    this.props.status = status

    this.addDomainEvent(new OrderStatusChangedEvent(this))

    this.touch()
  }

  get postedOn() {
    return this.props.postedOn
  }

  set postedOn(postedOn: Date | undefined | null) {
    if (postedOn === undefined || postedOn === null) {
      return
    }

    this.props.postedOn = postedOn

    this.touch()
  }

  get pickupDate() {
    return this.props.pickupDate
  }

  set pickupDate(pickupDate: Date | undefined | null) {
    if (pickupDate === undefined || pickupDate === null) {
      return
    }

    this.props.pickupDate = pickupDate

    this.touch()
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  set deliveryDate(deliveryDate: Date | undefined | null) {
    if (deliveryDate === undefined || deliveryDate === null) {
      return
    }

    this.props.deliveryDate = deliveryDate

    this.touch()
  }

  get deliveryPhotoId() {
    return this.props.deliveryPhotoId
  }

  set deliveryPhotoId(deliveryPhotoId: UniqueEntityID | undefined | null) {
    if (deliveryPhotoId === undefined || deliveryPhotoId === null) {
      return
    }

    this.props.deliveryPhotoId = deliveryPhotoId

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'PENDING',
      },
      id,
    )

    return order
  }
}
