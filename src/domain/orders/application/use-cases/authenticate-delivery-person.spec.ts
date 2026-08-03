import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { AuthenticateDeliveryPersonUseCase } from './authenticate-delivery-person'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateDeliveryPersonUseCase

describe('Authenticate Delivery Person', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateDeliveryPersonUseCase(
      inMemoryDeliveryPersonRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a delivery person', async () => {
    const deliveryPerson = makeDeliveryPerson({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliveryPersonRepository.items.push(deliveryPerson)

    const result = await sut.execute({
      cpf: '11111111111',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
