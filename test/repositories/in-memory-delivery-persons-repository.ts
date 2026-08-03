import { DeliveryPersonsRepository } from '@/domain/orders/application/repositories/delivery-persons-repository'
import { DeliveryPerson } from '@/domain/orders/enterprise/entities/delivery-person'

export class InMemoryDeliveryPersonsRepository implements DeliveryPersonsRepository {
  public items: DeliveryPerson[] = []

  async findByCpf(cpf: string) {
    const deliveryPerson = this.items.find((item) => item.cpf === cpf)

    if (!deliveryPerson) {
      return null
    }

    return deliveryPerson
  }

  async create(deliveryPerson) {
    this.items.push(deliveryPerson)
  }

  async save(deliveryPerson: DeliveryPerson) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    )

    this.items[itemIndex] = deliveryPerson
  }

  async findById(id: string) {
    const deliveryPerson = this.items.find((item) => item.id.toString() === id)

    if (!deliveryPerson) {
      return null
    }

    return deliveryPerson
  }

  async delete(deliveryPerson: DeliveryPerson): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
