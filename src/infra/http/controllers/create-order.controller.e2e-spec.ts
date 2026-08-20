import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'

describe('Create order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliveryPersonFactory: DeliveryPersonFactory
  let addresseeFactory: AddresseeFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryPersonFactory, AddresseeFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /orders', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const addresse = await addresseeFactory.makeAddressee()

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Order 1',
        addresseeId: addresse.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        name: 'Order 1',
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
