import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { GetOrderUseCase } from './get-order-by-id'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository

let sut: GetOrderUseCase

describe('Get Order By Id', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddresseesRepository,
    )

    sut = new GetOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get order by id', async () => {
    const order = makeOrder(
      {
        name: 'Order Example',
      },
      new UniqueEntityID('order-1'),
    )

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: 'order-1',
    })

    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        name: order.name,
      }),
    })
  })
})
