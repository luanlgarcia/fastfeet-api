import { DeliveryPerson } from '@/domain/orders/enterprise/entities/delivery-person'

export class DeliveryPersonPresenter {
  static toHTTP(deliveryPerson: DeliveryPerson) {
    return {
      id: deliveryPerson.id.toString(),
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
      createdAt: deliveryPerson.createdAt,
      updatedAt: deliveryPerson.updatedAt,
    }
  }
}
