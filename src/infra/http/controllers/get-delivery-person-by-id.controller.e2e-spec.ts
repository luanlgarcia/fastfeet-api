import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import request from 'supertest'

describe('Get delivery question by id (E2E)', () => {
  let app: INestApplication
  let deliveryPersonFactory: DeliveryPersonFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /delivery-persons/:id', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson({
      name: 'Jhon Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const deliveryPersonId = user.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/delivery-persons/${deliveryPersonId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryPerson: expect.objectContaining({
        id: deliveryPersonId,
        name: 'Jhon Doe',
      }),
    })
  })
})
