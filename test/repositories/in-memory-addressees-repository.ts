import { AddresseesRepository } from '@/domain/orders/application/repositories/addressees-repository'
import { Addressee } from '@/domain/orders/enterprise/entities/addressee'

export class InMemoryAddresseesRepository implements AddresseesRepository {
  public items: Addressee[] = []

  async findById(id: string) {
    const addressee = this.items.find((item) => item.id.toString() === id)

    if (!addressee) {
      return null
    }

    return addressee
  }
  async save(addressee: Addressee) {
    const itemIndex = this.items.findIndex((item) => item.id === addressee.id)

    this.items[itemIndex] = addressee
  }
  async create(addressee: Addressee) {
    this.items.push(addressee)
  }
  async delete(addressee: Addressee) {
    const itemIndex = this.items.findIndex((item) => item.id === addressee.id)

    this.items.splice(itemIndex, 1)
  }
}
