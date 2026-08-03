import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { EditPasswordPasswordDeliveryPersonUseCase } from './edit-password-delivery-person'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher

let sut: EditPasswordPasswordDeliveryPersonUseCase

describe('Edit Password Delivery Person', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()

    sut = new EditPasswordPasswordDeliveryPersonUseCase(
      inMemoryDeliveryPersonRepository,
      fakeHasher,
    )
  })

  it('should be able to edit password a deivery person', async () => {
    const deliveryPerson = makeDeliveryPerson(
      {},
      new UniqueEntityID('deliveryPerson-1'),
    )

    await inMemoryDeliveryPersonRepository.create(deliveryPerson)

    await sut.execute({
      deliveryPersonId: deliveryPerson.id.toValue(),
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(inMemoryDeliveryPersonRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
