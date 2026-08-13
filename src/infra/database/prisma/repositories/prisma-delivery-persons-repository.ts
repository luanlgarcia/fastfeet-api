import { DeliveryPersonsRepository } from '@/domain/orders/application/repositories/delivery-persons-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliveryPerson } from '@/domain/orders/enterprise/entities/delivery-person'
import { PrismaDeliveryPersonMapper } from '../mappers/prisma-delivery-person-mapper'

@Injectable()
export class PrismaDeliveryPersonsRepository implements DeliveryPersonsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryPerson) {
      return null
    }

    return PrismaDeliveryPersonMapper.toDomain(deliveryPerson)
  }

  async findById(id: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryPerson) {
      return null
    }

    return PrismaDeliveryPersonMapper.toDomain(deliveryPerson)
  }

  async save(deliveryPerson: DeliveryPerson): Promise<void> {
    const data = PrismaDeliveryPersonMapper.toPrisma(deliveryPerson)

    await this.prisma.user.update({
      where: {
        id: deliveryPerson.id.toString(),
      },
      data,
    })
  }

  async create(deliveryPerson: DeliveryPerson): Promise<void> {
    const data = PrismaDeliveryPersonMapper.toPrisma(deliveryPerson)

    await this.prisma.user.create({
      data,
    })
  }

  async delete(deliveryPerson: DeliveryPerson): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: deliveryPerson.id.toString(),
      },
    })
  }
}
