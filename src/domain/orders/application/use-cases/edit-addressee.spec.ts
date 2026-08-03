import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAddressee } from 'test/factories/make-addressee'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { EditAddresseeUseCase } from './edit-addressee'

let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: EditAddresseeUseCase

describe('Edit Addressee', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()

    sut = new EditAddresseeUseCase(inMemoryAddresseesRepository)
  })

  it('should be able to edit a addressee', async () => {
    const newAddressee = makeAddressee({}, new UniqueEntityID('addressee-1'))

    await inMemoryAddresseesRepository.create(newAddressee)

    await sut.execute({
      addresseeId: newAddressee.id.toValue(),
      name: 'Jhon Doe',
      city: 'City Example',
      number: '123',
      postalCode: '99999-999',
      state: 'State Example',
      street: 'Street Example',
    })

    expect(inMemoryAddresseesRepository.items[0]).toMatchObject({
      name: 'Jhon Doe',
      city: 'City Example',
      number: '123',
      postalCode: '99999-999',
      state: 'State Example',
      street: 'Street Example',
    })
  })
})
