import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { RegisterDeliveryPersonUseCase } from './register-delivery-person'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher

let sut: RegisterDeliveryPersonUseCase

describe('Register Delivery Person', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterDeliveryPersonUseCase(
      inMemoryDeliveryPersonRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'Jhon Doe',
      cpf: '999.999.999-10',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryPerson: inMemoryDeliveryPersonRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'Jhon Doe',
      cpf: '999.999.999-10',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryPersonRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
