import { INestApplication } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { OrderFactory } from 'test/factories/make-order'
import { DeliveryPhotoFactory } from 'test/factories/make-delivery-photo'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '../app.module'
import { DatabaseModule } from '../database/database.module'
import { DomainEvents } from '@/core/events/domain-events'
import request from 'supertest'
import { waitFor } from 'test/utils/wait-for'

describe('On order status changed (E2E)', () => {
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

    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    orderFactory = moduleRef.get(OrderFactory)
    deliveryPhotoFactory = moduleRef.get(DeliveryPhotoFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when an order is posted', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({ sub: user.id.toString() })

    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({ addresseeId: addressee.id })

    const orderId = order.id.toString()

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/post`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        orderId,
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: addressee.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })

  it('should send a notification when an order is picked up', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({ sub: user.id.toString() })

    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
      status: 'WAITING',
    })

    const orderId = order.id.toString()

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliveryPersonId: deliveryPerson.id.toString(),
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: addressee.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })

  it('should send a notification when an order is delivered', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({ sub: user.id.toString() })

    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
      status: 'PICKED_UP',
      deliveryPersonId: deliveryPerson.id,
    })

    const deliveryPhoto = await deliveryPhotoFactory.makePrismaDeliveryPhoto()

    const orderId = order.id.toString()

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliveryPersonId: deliveryPerson.id.toString(),
        deliveryPhotoId: deliveryPhoto.id.toString(),
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: addressee.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })

  it('should send a notification when an order is returned', async () => {
    const user = await deliveryPersonFactory.makePrismaDeliveryPerson()
    const accessToken = await jwt.sign({ sub: user.id.toString() })

    const deliveryPerson =
      await deliveryPersonFactory.makePrismaDeliveryPerson()

    const addressee = await addresseeFactory.makeAddressee()

    const order = await orderFactory.makeOrder({
      addresseeId: addressee.id,
      status: 'PICKED_UP',
      deliveryPersonId: deliveryPerson.id,
    })

    const orderId = order.id.toString()

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/return`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliveryPersonId: deliveryPerson.id.toString(),
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: addressee.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
