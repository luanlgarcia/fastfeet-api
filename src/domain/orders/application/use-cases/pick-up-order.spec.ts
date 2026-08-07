import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { PickUpOrderUseCase } from './pick-up-order'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InvalidOrderStatusError } from './errors/invalid-order-status-error'
import { OrderNotFoundError } from './errors/order-not-found-error'
import { DeliveryPersonNotFoundError } from './errors/delivery-person-not-found-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository
let sut: PickUpOrderUseCase

describe('Pick Up Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()

    sut = new PickUpOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryPersonRepository,
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'WAITING',
        },
        new UniqueEntityID('order-1'),
      ),
    )
    inMemoryDeliveryPersonRepository.items.push(
      makeDeliveryPerson({}, new UniqueEntityID('deliveryPerson1')),
    )
  })

  it('should be able to pick up an order', async () => {
    const result = await sut.execute({
      orderId: 'order-1',
      deliveryPersonId: 'deliveryPerson1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      status: 'PICKED_UP',
      pickupDate: expect.any(Date),
      deliveryPersonId: new UniqueEntityID('deliveryPerson1'),
    })
  })

  it('should not be able to pick up a non-existent order', async () => {
    const result = await sut.execute({
      orderId: 'order-wrong',
      deliveryPersonId: 'deliveryPerson1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotFoundError)
  })

  it('should not be able to pick up an order by a non-existent delivery person', async () => {
    const result = await sut.execute({
      orderId: 'order-1',
      deliveryPersonId: 'deliveryPerson-wrong',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryPersonNotFoundError)
  })

  it('should not be able to pick up an order that is not waiting for pickup', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'PENDING',
        },
        new UniqueEntityID('order-2'),
      ),
    )

    const result = await sut.execute({
      orderId: 'order-2',
      deliveryPersonId: 'deliveryPerson1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderStatusError)
  })
})
