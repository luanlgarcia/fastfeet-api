import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { EditOrderUseCase } from './edit-order'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { makeAddressee } from 'test/factories/make-addressee'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let sut: EditOrderUseCase

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()

    sut = new EditOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryAddresseesRepository,
    )
  })

  it('should be able to edit a order', async () => {
    const newAddress1 = makeAddressee({}, new UniqueEntityID('address-1'))

    const newAddress2 = makeAddressee({}, new UniqueEntityID('address-2'))

    inMemoryAddresseesRepository.items.push(newAddress1, newAddress2)

    const newOrder = makeOrder(
      {
        addresseeId: newAddress1.id,
      },
      new UniqueEntityID('order-1'),
    )

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toValue(),
      name: 'Order Example',
      addresseeId: newAddress2.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      name: 'Order Example',
      addresseeId: new UniqueEntityID('address-2'),
    })
  })
  it('should not be able to edit a order with a non-existent recipient', async () => {
    const newAddress1 = makeAddressee({}, new UniqueEntityID('address-1'))

    const newAddress2 = makeAddressee({}, new UniqueEntityID('address-2'))

    inMemoryAddresseesRepository.items.push(newAddress1, newAddress2)

    const newOrder = makeOrder(
      {
        addresseeId: newAddress1.id,
      },
      new UniqueEntityID('order-1'),
    )

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toValue(),
      name: 'Order Example',
      addresseeId: 'addressee-wrong',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
