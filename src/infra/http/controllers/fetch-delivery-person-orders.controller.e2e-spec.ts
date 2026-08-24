import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { OrderFactory } from 'test/factories/make-order'
import request from 'supertest'

describe('Fetch Delivery Person Orders (E2E)', () => {
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

  test('[GET] /delivery-persons/orders', async () => {
    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()
    const acessToken = await jwt.sign({
      sub: deliveryPerson.id.toString(),
      role: 'DELIVERY_PERSON',
    })

    const deliveryPerson2 =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const addressee = await addresseeFactory.makeAddressee()

    const order1 = await orderFactory.makeOrder({
      addresseeId: addressee.id,
      deliveryPersonId: deliveryPerson.id,
      status: 'PICKED_UP',
    })

    const order2 = await orderFactory.makeOrder({
      addresseeId: addressee.id,
      deliveryPersonId: deliveryPerson.id,
      status: 'PICKED_UP',
    })

    await orderFactory.makeOrder({
      addresseeId: addressee.id,
      deliveryPersonId: deliveryPerson2.id,
      status: 'PICKED_UP',
    })

    const response = await request(app.getHttpServer())
      .get('/delivery-persons/orders')
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(2)
    expect(response.body.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: order1.id.toString(),
          addressee: expect.objectContaining({ name: addressee.name }),
        }),
        expect.objectContaining({
          id: order2.id.toString(),
        }),
      ]),
    )
  })
})
