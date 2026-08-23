import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '../../database.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { OrdersRepository } from '@/domain/orders/application/repositories/orders-repository'
import { PrismaOrderDetailsMapper } from '../mappers/prisma-order-details-mapper'
import { OrderDetails } from '@/domain/orders/enterprise/entities/value-objects/order-details'

describe('Prisma Orders Repository (E2E)', () => {
  let app: INestApplication
  let addresseeFactory: AddresseeFactory
  let orderFactory: OrderFactory
  let cacheRepository: CacheRepository
  let ordersRepository: OrdersRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [AddresseeFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    addresseeFactory = moduleRef.get(AddresseeFactory)
    orderFactory = moduleRef.get(OrderFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    ordersRepository = moduleRef.get(OrdersRepository)

    await app.init()
  })

  it('should cache order details', async () => {
    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
    })

    const orderId = order.id.toString()

    const orderDetails = await ordersRepository.findDetailsById(orderId)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    expect(cached).toEqual(
      JSON.stringify(PrismaOrderDetailsMapper.toCache(orderDetails!)),
    )
  })

  it('should return cached order details on subsequent calls', async () => {
    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
    })

    const orderId = order.id.toString()

    const orderDetails = await ordersRepository.findDetailsById(orderId)

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({
        ...PrismaOrderDetailsMapper.toCache(orderDetails!),
        name: 'cached order name',
      }),
    )

    const cached = await ordersRepository.findDetailsById(orderId)

    expect(cached).toBeInstanceOf(OrderDetails)
    expect(cached?.name).toBe('cached order name')
  })

  it('should reset order details cache when saving the order', async () => {
    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
    })

    const orderId = order.id.toString()

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ empty: true }),
    )

    await ordersRepository.save(order)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    expect(cached).toBeNull()
  })

  it('should reset order details cache when deleting the order', async () => {
    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
    })

    const orderId = order.id.toString()

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ empty: true }),
    )

    await ordersRepository.delete(order)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    expect(cached).toBeNull()
  })
})
