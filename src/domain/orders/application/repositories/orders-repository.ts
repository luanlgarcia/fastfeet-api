import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import { Coordinate } from '../../enterprise/entities/value-objects/coordinate'
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details'

export const MAX_DISTANCE_IN_KILOMETERS = 10

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findDetailsById(id: string): Promise<OrderDetails | null>
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
