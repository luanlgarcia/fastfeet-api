import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { OrderFactory } from 'test/factories/make-order'
import request from 'supertest'

describe('Edit Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliveryPersonFactory: DeliveryPersonFactory
  let addresseeFactory: AddresseeFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, AddresseeFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[PUT] /orders/:id', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const addressee1 = await addresseeFactory.makeAddressee()
    const addressee2 = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({ addresseeId: addressee1.id })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Order-1',
        addresseeId: addressee2.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        name: 'Order-1',
        addresseeId: addressee2.id.toString(),
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
