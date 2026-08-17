import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import request from 'supertest'

describe('Edit Delivery Person (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliveryPersonFactory: DeliveryPersonFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)

    await app.init()
  })

  test('[PUT] /delivery-persons/:id', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const deliverypersonId = user.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/delivery-persons/${deliverypersonId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Jhon Doe',
      })

    expect(response.statusCode).toBe(204)

    const deliveryPersonOnDatabase = await prisma.user.findFirst({
      where: {
        name: 'New Jhon Doe',
      },
    })

    expect(deliveryPersonOnDatabase).toBeTruthy()
  })
})
