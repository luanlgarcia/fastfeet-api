import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { AdminFactory } from 'test/factories/make-admin'

describe('Get addressee by id (E2E)', () => {
  let app: INestApplication
  let addresseeFactory: AddresseeFactory
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AddresseeFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /addressees/:id', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

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
