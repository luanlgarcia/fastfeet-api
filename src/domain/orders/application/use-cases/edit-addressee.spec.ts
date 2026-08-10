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
      latitude: -19.472368048012747,
      longitude: -42.54958052250055,
    })

    expect(inMemoryAddresseesRepository.items[0]).toMatchObject({
      name: 'Jhon Doe',
      city: 'City Example',
      number: '123',
      postalCode: '99999-999',
      state: 'State Example',
      street: 'Street Example',
      coordinate: {
        latitude: -19.472368048012747,
        longitude: -42.54958052250055,
      },
    })
  })
})
