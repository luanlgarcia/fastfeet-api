import { DeliveryPerson } from '../../enterprise/entities/delivery-person'

export abstract class DeliveryPersonsRepository {
  abstract findByCpf(cpf: string): Promise<DeliveryPerson | null>
  abstract findById(id: string): Promise<DeliveryPerson | null>
  abstract save(deliveryPerson: DeliveryPerson): Promise<void>
  abstract create(deliveryPerson: DeliveryPerson): Promise<void>
  abstract delete(deliveryPerson: DeliveryPerson): Promise<void>
}
