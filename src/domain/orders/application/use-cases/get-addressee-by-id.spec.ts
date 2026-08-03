import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAddressee } from 'test/factories/make-addressee'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { GetAddresseeUseCase } from './get-addressee-by-id'

let inMemoryAddresseesRepository: InMemoryAddresseesRepository

let sut: GetAddresseeUseCase

describe('Get Addresse By Id', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()

    sut = new GetAddresseeUseCase(inMemoryAddresseesRepository)
  })

  it('should be able to get a addresse by id', async () => {
    const addressee = makeAddressee(
      {
        name: 'Jhon Doe',
      },
      new UniqueEntityID('addressee-1'),
    )

    await inMemoryAddresseesRepository.create(addressee)

    const result = await sut.execute({
      addresseeId: 'addressee-1',
    })

    expect(result.value).toMatchObject({
      addressee: expect.objectContaining({
        name: addressee.name,
      }),
    })
  })
})
