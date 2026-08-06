import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAddressee } from 'test/factories/make-addressee'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { DeleteAddresseeUseCase } from './delete-addressee'

let inMemoryAddresseeRepository: InMemoryAddresseesRepository

let sut: DeleteAddresseeUseCase

describe('Delete Addressee', () => {
  beforeEach(() => {
    inMemoryAddresseeRepository = new InMemoryAddresseesRepository()

    sut = new DeleteAddresseeUseCase(inMemoryAddresseeRepository)
  })

  it('should be able to delete a addressee', async () => {
    const addressee = makeAddressee({}, new UniqueEntityID('addressee-1'))

    await inMemoryAddresseeRepository.create(addressee)

    await sut.execute({
      addresseeId: 'addressee-1',
    })

    expect(inMemoryAddresseeRepository.items).toHaveLength(0)
  })
})
