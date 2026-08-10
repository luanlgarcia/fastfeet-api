import { Order } from '../../enterprise/entities/order'
import { Coordinate } from '../../enterprise/entities/value-objects/coordinate'

export const MAX_DISTANCE_IN_KILOMETERS = 10

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyNearby(params: {
    coordinate: Coordinate
    page: number
  }): Promise<Order[]>
  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
