import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { DeleteDeliveryPersonUseCase } from './delete-delivery-person'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository

let sut: DeleteDeliveryPersonUseCase

describe('Delete Delivery Person', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()

    sut = new DeleteDeliveryPersonUseCase(inMemoryDeliveryPersonRepository)
  })

  it('should be able to delete a deivery person', async () => {
    const deliveryPerson = makeDeliveryPerson(
      {},
      new UniqueEntityID('deliveryPerson-1'),
    )

    await inMemoryDeliveryPersonRepository.create(deliveryPerson)

    await sut.execute({
      deliveryPersonId: 'deliveryPerson-1',
    })

    expect(inMemoryDeliveryPersonRepository.items).toHaveLength(0)
  })
})
