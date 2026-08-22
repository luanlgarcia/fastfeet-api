import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create addressee (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /addressees', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const response = await request(app.getHttpServer())
      .post('/addressees')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jhon Doe',
        city: 'City Example',
        number: '123',
        postalCode: '99999999',
        state: 'MG',
        street: 'Street Example',
        latitude: -19.472368048012747,
        longitude: -42.54958052250055,
      })

    expect(response.statusCode).toBe(201)

    const addresseeOnDatabase = await prisma.addressee.findFirst({
      where: {
        name: 'Jhon Doe',
      },
    })

    expect(addresseeOnDatabase).toBeTruthy()
  })
})
