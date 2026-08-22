import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import request from 'supertest'

describe('Upload delivery photo (E2E)', () => {
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

  test('[POST] /delivery-photos', async () => {
    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({
      sub: deliveryPerson.id.toString(),
      role: 'DELIVERY_PERSON',
    })

    const response = await request(app.getHttpServer())
      .post('/delivery-photos')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpeg')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      deliveryPhotoId: expect.any(String),
    })
  })
})
