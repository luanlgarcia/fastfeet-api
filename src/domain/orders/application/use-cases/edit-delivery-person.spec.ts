import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { EditDeliveryPersonUseCase } from './edit-delivery-person'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository

let sut: EditDeliveryPersonUseCase

describe('Edit Delivery Person', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()

    sut = new EditDeliveryPersonUseCase(inMemoryDeliveryPersonRepository)
  })

  it('should be able to edit a delivery person', async () => {
    const deliveryPerson = makeDeliveryPerson(
      {
        name: 'Jhon Doe',
      },
      new UniqueEntityID('deliveryPerson-1'),
    )

    await inMemoryDeliveryPersonRepository.create(deliveryPerson)

    await sut.execute({
      deliveryPersonId: deliveryPerson.id.toValue(),
      name: 'Jhon Doe 1',
    })

    expect(inMemoryDeliveryPersonRepository.items[0]).toMatchObject({
      name: 'Jhon Doe 1',
    })
  })
})
