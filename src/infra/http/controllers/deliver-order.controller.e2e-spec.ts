import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { OrderFactory } from 'test/factories/make-order'
import request from 'supertest'
import { DeliveryPhotoFactory } from 'test/factories/make-delivery-photo'

describe('Deliver Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliveryPersonFactory: DeliveryPersonFactory
  let addresseeFactory: AddresseeFactory
  let orderFactory: OrderFactory
  let deliveryPhotoFactory: DeliveryPhotoFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliveryPersonFactory,
        AddresseeFactory,
        OrderFactory,
        DeliveryPhotoFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    orderFactory = moduleRef.get(OrderFactory)
    deliveryPhotoFactory = moduleRef.get(DeliveryPhotoFactory)

    await app.init()
  })

  test('[PATCH] /orders/:id/deliver', async () => {
    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const accessToken = jwt.sign({
      sub: deliveryPerson.id.toString(),
      role: 'DELIVERY_PERSON',
    })

    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
      status: 'PICKED_UP',
      deliveryPersonId: deliveryPerson.id,
    })

    const deliveryPhoto = await deliveryPhotoFactory.makePrismaDeliveryPhoto()

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliveryPersonId: deliveryPerson.id.toString(),
        deliveryPhotoId: deliveryPhoto.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        id: orderId,
        status: 'DELIVERED',
        deliveryPersonId: deliveryPerson.id.toString(),
        deliveryPhotoId: deliveryPhoto.id.toString(),
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
