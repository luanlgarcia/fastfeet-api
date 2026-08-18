import { Addressee } from '@/domain/orders/enterprise/entities/addressee'
import { Prisma, Addressee as PrismaAddressee } from '../generated/client'
import { Coordinate } from '@/domain/orders/enterprise/entities/value-objects/coordinate'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaAddresseeMapper {
  static toDomain(raw: PrismaAddressee): Addressee {
    return Addressee.create(
      {
        name: raw.name,
        city: raw.city,
        street: raw.street,
        state: raw.state,
        number: raw.number,
        postalCode: raw.postalCode,
        coordinate: Coordinate.create({
          latitude: raw.latitude,
          longitude: raw.longitude,
        }),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(addressee: Addressee): Prisma.AddresseeUncheckedCreateInput {
    return {
      id: addressee.id.toString(),
      name: addressee.name,
      street: addressee.street,
      number: addressee.number,
      city: addressee.city,
      state: addressee.state,
      postalCode: addressee.postalCode,
      latitude: addressee.coordinate.latitude,
      longitude: addressee.coordinate.longitude,
      createdAt: addressee.createdAt,
      updatedAt: addressee.updatedAt,
    }
  }
}
