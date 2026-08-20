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

describe('Delete order (E2E)', () => {
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
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /orders/:id', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const addresse = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({ addresseeId: addresse.id })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const addresseOnDatabase = await prisma.user.findUnique({
      where: {
        id: orderId,
      },
    })

    expect(addresseOnDatabase).toBeNull()
  })
})
