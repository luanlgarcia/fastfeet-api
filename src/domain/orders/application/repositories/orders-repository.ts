import { Order } from '../../enterprise/entities/order'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
