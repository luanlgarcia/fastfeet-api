import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import { Coordinate } from '../../enterprise/entities/value-objects/coordinate'

export const MAX_DISTANCE_IN_KILOMETERS = 10

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyByDeliveryPersonId(
    deliveryPersonId: string,
    params: PaginationParams,
  ): Promise<Order[]>
  abstract findManyNearby(
    coordinate: Coordinate,
    params: PaginationParams,
  ): Promise<Order[]>
  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
