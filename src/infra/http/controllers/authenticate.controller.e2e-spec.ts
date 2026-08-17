import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let deliveryPersonFactory: DeliveryPersonFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await deliveryPersonFactory.makePrismaDeliveryPerson({
      cpf: '99999999999',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: '99999999999',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
