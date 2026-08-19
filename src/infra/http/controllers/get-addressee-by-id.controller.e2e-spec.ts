import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import request from 'supertest'
import { AddresseeFactory } from 'test/factories/make-addressee'

describe('Get addressee by id (E2E)', () => {
  let app: INestApplication
  let deliveryPersonFactory: DeliveryPersonFactory
  let addresseeFactory: AddresseeFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, AddresseeFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /addressees/:id', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const addressee = await addresseeFactory.makeAddressee({
      name: 'Jhon Doe',
    })

    const addresseeId = addressee.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/addressees/${addresseeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      addressee: expect.objectContaining({
        id: addresseeId,
        name: 'Jhon Doe',
      }),
    })
  })
})
