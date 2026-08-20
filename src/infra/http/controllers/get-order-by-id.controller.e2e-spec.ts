import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { OrderFactory } from 'test/factories/make-order'
import request from 'supertest'

describe('Get order by id (E2E)', () => {
  let app: INestApplication
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

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /orders/:id', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const addressee = await addresseeFactory.makeAddressee({
      name: 'Jhon Doe',
    })

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
      name: 'order 1',
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: orderId,
        name: 'order 1',
        addressee: expect.objectContaining({
          name: addressee.name,
          city: addressee.city,
        }),
      }),
    })
  })
})
