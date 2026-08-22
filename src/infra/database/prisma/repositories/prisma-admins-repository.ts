import { AdminsRepository } from '@/domain/orders/application/repositories/admins-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Admin } from '@/domain/orders/enterprise/entities/admin'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findFirst({
      where: {
        cpf,
        role: 'ADMIN',
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findFirst({
      where: {
        id,
        role: 'ADMIN',
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }
}
