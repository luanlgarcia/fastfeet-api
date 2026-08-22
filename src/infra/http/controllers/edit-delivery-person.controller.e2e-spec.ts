import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Edit Delivery Person (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliveryPersonFactory: DeliveryPersonFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    adminFactory = moduleRef.get(AdminFactory)
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)

    await app.init()
  })

  test('[PUT] /delivery-persons/:id', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const deliverypersonId = deliveryPerson.id.toString()

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
