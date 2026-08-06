import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { DeleteOrderUseCase } from './delete-order'

let inMemoryOrderRepository: InMemoryOrdersRepository

let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrdersRepository()

    sut = new DeleteOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to delete a order', async () => {
    const order = makeOrder({}, new UniqueEntityID('order-1'))

    await inMemoryOrderRepository.create(order)

    await sut.execute({
      orderId: 'order-1',
    })

    expect(inMemoryOrderRepository.items).toHaveLength(0)
  })
})
