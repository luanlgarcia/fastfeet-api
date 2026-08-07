import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeAddressee } from 'test/factories/make-addressee'
import { PostOrderUseCase } from './post-order'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InvalidOrderStatusError } from './errors/invalid-order-status-error'
import { OrderWithoutAddresseeError } from './errors/order-without-addressee-error'
import { OrderNotFoundError } from './errors/order-not-found-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: PostOrderUseCase

describe('Post Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()

    sut = new PostOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryAddresseesRepository,
    )

    inMemoryAddresseesRepository.items.push(
      makeAddressee({}, new UniqueEntityID('address-1')),
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          addresseeId: new UniqueEntityID('address-1'),
        },
        new UniqueEntityID('order-1'),
      ),
    )
  })

  it('should be able to post an order and mark it as waiting', async () => {
    const result = await sut.execute({
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      status: 'WAITING',
      postedOn: expect.any(Date),
    })
  })

  it('should not be able to post a non-existent order', async () => {
    const result = await sut.execute({
      orderId: 'order-wrong',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotFoundError)
  })

  it('should not be able to post a non-existent order', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          addresseeId: new UniqueEntityID('address-1'),
          status: 'RETURNED',
        },
        new UniqueEntityID('order-2'),
      ),
    )

    const result = await sut.execute({
      orderId: 'order-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderStatusError)
  })

  it('should not be able to post an order without a valid addressee', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          addresseeId: new UniqueEntityID('address-2'),
        },
        new UniqueEntityID('order-2'),
      ),
    )

    const result = await sut.execute({
      orderId: 'order-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderWithoutAddresseeError)
  })
})
