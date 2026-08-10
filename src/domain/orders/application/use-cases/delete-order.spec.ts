import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { DeleteOrderUseCase } from './delete-order'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository

let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddresseesRepository,
    )

    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete a order', async () => {
    const order = makeOrder({}, new UniqueEntityID('order-1'))

    await inMemoryOrdersRepository.create(order)

    await sut.execute({
      orderId: 'order-1',
    })

    expect(inMemoryOrdersRepository.items).toHaveLength(0)
  })
})
