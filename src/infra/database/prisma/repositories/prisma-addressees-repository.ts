import { AddresseesRepository } from '@/domain/orders/application/repositories/addressees-repository'
import { Addressee } from '@/domain/orders/enterprise/entities/addressee'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAddresseeMapper } from '../mappers/prisma-addressee-mapper'

@Injectable()
export class PrismaAddresseesRepository implements AddresseesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const addressee = await this.prisma.addressee.findUnique({ where: { id } })

    if (!addressee) {
      return null
    }

    return PrismaAddresseeMapper.toDomain(addressee)
  }

  async create(addressee: Addressee) {
    await this.prisma.addressee.create({
      data: PrismaAddresseeMapper.toPrisma(addressee),
    })
  }

  async save(addressee: Addressee) {
    await this.prisma.addressee.update({
      where: { id: addressee.id.toString() },
      data: PrismaAddresseeMapper.toPrisma(addressee),
    })
  }

  async delete(addressee: Addressee) {
    await this.prisma.addressee.delete({
      where: { id: addressee.id.toString() },
    })
  }
}
