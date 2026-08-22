import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddresseeFactory } from 'test/factories/make-addressee'
import { AdminFactory } from 'test/factories/make-admin'

describe('Delete Addressee (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let addresseeFactory: AddresseeFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, AddresseeFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    addresseeFactory = moduleRef.get(AddresseeFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /addressees/:id', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString(), role: 'ADMIN' })

    const addresse = await addresseeFactory.makeAddressee()

    const addresseId = addresse.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/addressees/${addresseId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const addresseOnDatabase = await prisma.user.findUnique({
      where: {
        id: addresseId,
      },
    })

    expect(addresseOnDatabase).toBeNull()
  })
})
