import {
  MAX_DISTANCE_IN_KILOMETERS,
  OrdersRepository,
} from '@/domain/orders/application/repositories/orders-repository'
import { Order } from '@/domain/orders/enterprise/entities/order'
import { Coordinate } from '@/domain/orders/enterprise/entities/value-objects/coordinate'
import { AddresseesRepository } from '@/domain/orders/application/repositories/addressees-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(private addresseesRepository: AddresseesRepository) {}

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyNearby(params: { coordinate: Coordinate; page: number }) {
    const ordersWithDistance = await Promise.all(
      this.items
        .filter((item) => item.status === 'WAITING')
        .map(async (order) => {
          const addressee = await this.addresseesRepository.findById(
            order.addresseeId.toString(),
          )

          return {
            order,
            distance: addressee
              ? addressee.coordinate.distanceTo(params.coordinate)
              : Infinity,
          }
        }),
    )

    return ordersWithDistance
      .filter((item) => item.distance <= MAX_DISTANCE_IN_KILOMETERS)
      .sort((a, b) => a.distance - b.distance)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((item) => item.order)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }
  async create(order: Order) {
    this.items.push(order)
  }
  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
