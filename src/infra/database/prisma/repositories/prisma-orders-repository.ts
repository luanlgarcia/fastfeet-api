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

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

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
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliveryPersonId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findDetailsById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { addressee: true },
    })

    if (!order) {
      return null
    }

    return PrismaOrderDetailsMapper.toDomain(order)
  }

  async findManyNearby(
    coordinate: Coordinate,
    { page }: PaginationParams,
  ): Promise<Order[]> {
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
    })

    const ordersById = new Map(orders.map((order) => [order.id, order]))

    return ids
      .map((id) => ordersById.get(id))
      .filter((order) => order !== undefined)
      .map(PrismaOrderMapper.toDomain)
  }

  async save(order: Order): Promise<void> {
    await this.prisma.order.update({
      where: { id: order.id.toString() },
      data: PrismaOrderMapper.toPrisma(order),
    })
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
  }
}
