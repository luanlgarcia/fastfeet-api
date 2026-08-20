import { DeliveryPhotosRepository } from '@/domain/orders/application/repositories/delivery-photos-repository'
import { DeliveryPhoto } from '@/domain/orders/enterprise/entities/delivery-photo'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDeliveryPhotoMapper } from '../mappers/prisma-delivery-photo-mapper'

@Injectable()
export class PrismaDeliveryPhotosRepository implements DeliveryPhotosRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const deliveryPhoto = await this.prisma.deliveryPhoto.findUnique({
      where: { id },
    })

    if (!deliveryPhoto) {
      return null
    }

    return PrismaDeliveryPhotoMapper.toDomain(deliveryPhoto)
  }

  async create(deliveryPhoto: DeliveryPhoto) {
    await this.prisma.deliveryPhoto.create({
      data: PrismaDeliveryPhotoMapper.toPrisma(deliveryPhoto),
    })
  }
}
