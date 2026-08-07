import { AdminsRepository } from '@/domain/orders/application/repositories/admins-repository'
import { Admin } from '@/domain/orders/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCpf(cpf: string) {
    const admin = this.items.find((item) => item.cpf === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }
}
