import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { Coordinate } from '@/domain/orders/enterprise/entities/value-objects/coordinate'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { OrderFactory } from 'test/factories/make-order'
import request from 'supertest'

describe('Fetch nearby orders (E2E)', () => {
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

  test('[GET] /orders/nearby', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = await jwt.sign({
      sub: user.id.toString(),
      role: 'DELIVERY_PERSON',
    })

    // Av. Paulista — ~2,7 km da Sé
    const nearbyAddressee = await addresseeFactory.makeAddressee({
      name: 'Nearby Addressee',
      coordinate: Coordinate.create({
        latitude: -23.5613,
        longitude: -46.6565,
      }),
    })

    // Rio de Janeiro — ~360 km da Sé
    const farAwayAddressee = await addresseeFactory.makeAddressee({
      name: 'Far Away Addressee',
      coordinate: Coordinate.create({
        latitude: -22.9068,
        longitude: -43.1729,
      }),
    })

    await orderFactory.makeOrder({
      name: 'Nearby Order',
      status: 'WAITING',
      addresseeId: nearbyAddressee.id,
    })

    await orderFactory.makeOrder({
      name: 'Far Away Order',
      status: 'WAITING',
      addresseeId: farAwayAddressee.id,
    })

    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .query({ latitude: -23.5505, longitude: -46.6333 })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(1)
    expect(response.body.orders[0]).toEqual(
      expect.objectContaining({
        name: 'Nearby Order',
        status: 'WAITING',
        addressee: expect.objectContaining({
          name: 'Nearby Addressee',
        }),
      }),
    )
  })
})
