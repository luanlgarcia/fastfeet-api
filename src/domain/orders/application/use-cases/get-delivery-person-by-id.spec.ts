import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { GetDeliveryPersonUseCase } from './get-delivery-person-by-id'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository

let sut: GetDeliveryPersonUseCase

describe('Get Delivery Person By Id', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()

    sut = new GetDeliveryPersonUseCase(inMemoryDeliveryPersonRepository)
  })

  it('should be able to get a delivery person by id', async () => {
    const deliveryPerson = makeDeliveryPerson(
      {
        name: 'Jhon Doe',
      },
      new UniqueEntityID('deliveryPerson-1'),
    )

    await inMemoryDeliveryPersonRepository.create(deliveryPerson)

    const result = await sut.execute({
      deliveryPersonId: 'deliveryPerson-1',
    })

    expect(result.value).toMatchObject({
      deliveryPerson: expect.objectContaining({
        name: deliveryPerson.name,
      }),
    })
  })
})
