import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { CreateAddresseeUseCase } from './create-addressee'

let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: CreateAddresseeUseCase

describe('Create Addressee', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()

    sut = new CreateAddresseeUseCase(inMemoryAddresseesRepository)
  })

  it('should be able to create a addressee', async () => {
    const result = await sut.execute({
      name: 'Jhon Doe',
      city: 'City Example',
      number: '123',
      postalCode: '99999-999',
      state: 'State Example',
      street: 'Street Example',
    })

    expect(result.isRight()).toBe(true)
  })
})
