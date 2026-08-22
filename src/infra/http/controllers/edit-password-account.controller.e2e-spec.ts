import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import request from 'supertest'
import { compare } from 'bcryptjs'
import { AdminFactory } from 'test/factories/make-admin'

describe('Edit Account Password (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let deliveryPersonFactory: DeliveryPersonFactory
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[PATCH] /accounts/:id/reset-password', async () => {
    const user = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const deliveryPersonId = deliveryPerson.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/accounts/${deliveryPersonId}/reset-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '123456',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: { id: deliveryPersonId },
    })

    expect(userOnDatabase).toBeTruthy()

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      userOnDatabase!.password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
