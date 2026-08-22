import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/orders/enterprise/entities/admin'
import { Prisma, User as PrismaUser } from '../generated/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf,
      password: admin.password,
      role: 'ADMIN',
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }
}
