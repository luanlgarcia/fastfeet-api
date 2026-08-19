import { Addressee } from '@/domain/orders/enterprise/entities/addressee'

export class AddresseePresenter {
  static toHTTP(addressee: Addressee) {
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
