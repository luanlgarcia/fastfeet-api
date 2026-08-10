import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository

let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddresseesRepository,
    )

    sut = new CreateOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to create a order', async () => {
    const result = await sut.execute({
      name: 'Package 1',
      addresseeId: '1',
    })

    expect(result.isRight()).toBe(true)
  })
})
