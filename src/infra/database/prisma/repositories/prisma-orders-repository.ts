import {
  MAX_DISTANCE_IN_KILOMETERS,
  OrdersRepository,
} from '@/domain/orders/application/repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/orders/enterprise/entities/order'
import { Coordinate } from '@/domain/orders/enterprise/entities/value-objects/coordinate'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaOrderDetailsMapper } from '../mappers/prisma-order-details-mapper'
import { OrderDetails } from '@/domain/orders/enterprise/entities/value-objects/order-details'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({ where: { id } })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyByDeliveryPersonId(
    deliveryPersonId: string,
    { page }: PaginationParams,
  ): Promise<OrderDetails[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliveryPersonId,
      },
      include: { addressee: true },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaOrderDetailsMapper.toDomain)
  }

  async findDetailsById(id: string): Promise<OrderDetails | null> {
    const cacheHit = await this.cache.get(`order:${id}:details`)

    if (cacheHit) {
      return PrismaOrderDetailsMapper.fromCache(JSON.parse(cacheHit))
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { addressee: true },
    })

    if (!order) {
      return null
    }

    const orderDetails = PrismaOrderDetailsMapper.toDomain(order)

    await this.cache.set(
      `order:${id}:details`,
      JSON.stringify(PrismaOrderDetailsMapper.toCache(orderDetails)),
    )

    return orderDetails
  }

  async findManyNearby(
    coordinate: Coordinate,
    { page }: PaginationParams,
  ): Promise<OrderDetails[]> {
    const { latitude, longitude } = coordinate

    const nearby = await this.prisma.$queryRaw<{ id: string }[]>`
    WITH nearby AS (
      SELECT
        o.id,
        6371 * acos(
          cos(radians(${latitude})) * cos(radians(a.latitude)) *
          cos(radians(a.longitude) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(a.latitude))
        ) AS distance
      FROM orders o
      JOIN addressees a ON a.id = o.addressee_id
      WHERE o.status = 'WAITING'
    )
    SELECT id
    FROM nearby
    WHERE distance <= ${MAX_DISTANCE_IN_KILOMETERS}
    ORDER BY distance ASC
    LIMIT 20
    OFFSET ${(page - 1) * 20}
  `

    const ids = nearby.map((row) => row.id)

    const orders = await this.prisma.order.findMany({
      where: { id: { in: ids } },
      include: { addressee: true },
    })

    const ordersById = new Map(orders.map((order) => [order.id, order]))

    return ids
      .map((id) => ordersById.get(id))
      .filter((order) => order !== undefined)
      .map(PrismaOrderDetailsMapper.toDomain)
  }

  async save(order: Order): Promise<void> {
    await this.prisma.order.update({
      where: { id: order.id.toString() },
      data: PrismaOrderMapper.toPrisma(order),
    })

    await this.cache.delete(`order:${order.id.toString()}:details`)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: { id: order.id.toString() },
    })

    await this.cache.delete(`order:${order.id.toString()}:details`)
  }
}
