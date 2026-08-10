import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InvalidOrderStatusError } from './errors/invalid-order-status-error'
import { OrderNotFoundError } from './errors/order-not-found-error'
import { DeliverOrderUseCase } from './deliver-order'
import { DeliveryPersonNotFoundError } from './errors/delivery-person-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonsRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository

let sut: DeliverOrderUseCase

describe('Deliver Order', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddresseesRepository,
    )
    inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonsRepository()

    sut = new DeliverOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryPersonRepository,
    )

    inMemoryDeliveryPersonRepository.items.push(
      makeDeliveryPerson({}, new UniqueEntityID('deliveryPerson1')),
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'PICKED_UP',
          deliveryPersonId: new UniqueEntityID('deliveryPerson1'),
        },
        new UniqueEntityID('order-1'),
      ),
    )
  })

  it('should be able to deliver an order', async () => {
    const result = await sut.execute({
      orderId: 'order-1',
      deliveryPersonId: 'deliveryPerson1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      status: 'DELIVERED',
      deliveryDate: expect.any(Date),
    })
  })

  it('should not be able to deliver a non-existent order', async () => {
    const result = await sut.execute({
      orderId: 'order-wrong',
      deliveryPersonId: 'deliveryPerson1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotFoundError)
  })

  it('should not be able to deliver an order by a non-existent delivery person', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'PICKED_UP',
          deliveryPersonId: new UniqueEntityID('deleted-deliveryPerson'),
        },
        new UniqueEntityID('order-2'),
      ),
    )

    const result = await sut.execute({
      orderId: 'order-2',
      deliveryPersonId: 'deleted-deliveryPerson',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryPersonNotFoundError)
  })

  it('should not be able to deliver an order that has not been picked up', async () => {
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

  it('should not be able to deliver an order picked up by another delivery person', async () => {
    const result = await sut.execute({
      orderId: 'order-1',
      deliveryPersonId: 'deliveryPerson2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
