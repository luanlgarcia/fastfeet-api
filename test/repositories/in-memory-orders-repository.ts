import {
  MAX_DISTANCE_IN_KILOMETERS,
  OrdersRepository,
} from '@/domain/orders/application/repositories/orders-repository'
import { Order } from '@/domain/orders/enterprise/entities/order'
import { Coordinate } from '@/domain/orders/enterprise/entities/value-objects/coordinate'
import { AddresseesRepository } from '@/domain/orders/application/repositories/addressees-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderDetails } from '@/domain/orders/enterprise/entities/value-objects/order-details'
import { Addressee } from '@/domain/orders/enterprise/entities/addressee'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(private addresseesRepository: AddresseesRepository) {}

  private toDetails(order: Order, addressee: Addressee): OrderDetails {
    return OrderDetails.create({
      orderId: order.id,
      name: order.name,
      status: order.status,
      addresseeId: addressee.id,
      addressee: addressee.name,
      street: addressee.street,
      number: addressee.number,
      city: addressee.city,
      state: addressee.state,
      postalCode: addressee.postalCode,
      deliveryPersonId: order.deliveryPersonId,
      deliveryPhotoId: order.deliveryPhotoId,
      postedOn: order.postedOn,
      pickupDate: order.pickupDate,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByDeliveryPersonId(
    deliveryPersonId: string,
    { page }: PaginationParams,
  ) {
    const orders = this.items
      .filter((item) => item.deliveryPersonId?.toString() === deliveryPersonId)
      .slice((page - 1) * 20, page * 20)

    const details: OrderDetails[] = []

    for (const order of orders) {
      const addressee = await this.addresseesRepository.findById(
        order.addresseeId.toString(),
      )

      if (!addressee) {
        throw new Error(
          `Addressee "${order.addresseeId.toString()}" does not exist.`,
        )
      }

      details.push(this.toDetails(order, addressee))
    }

    return details
  }

  async findDetailsById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    const addressee = await this.addresseesRepository.findById(
      order.addresseeId.toString(),
    )

    if (!addressee) {
      throw new Error(
        `Addressee "${order.addresseeId.toString()}" does not exist.`,
      )
    }

    return this.toDetails(order, addressee)
  }

  async findManyNearby(coordinate: Coordinate, { page }: PaginationParams) {
    const nearby: { details: OrderDetails; distance: number }[] = []

    for (const order of this.items) {
      if (order.status !== 'WAITING') {
        continue
      }

      const addressee = await this.addresseesRepository.findById(
        order.addresseeId.toString(),
      )

      if (!addressee) {
        continue
      }

      const distance = addressee.coordinate.distanceTo(coordinate)

      if (distance > MAX_DISTANCE_IN_KILOMETERS) {
        continue
      }

      nearby.push({
        distance,
        details: this.toDetails(order, addressee),
      })
    }

    return nearby
      .sort((a, b) => a.distance - b.distance)
      .slice((page - 1) * 20, page * 20)
      .map((item) => item.details)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
  async create(order: Order) {
    this.items.push(order)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
