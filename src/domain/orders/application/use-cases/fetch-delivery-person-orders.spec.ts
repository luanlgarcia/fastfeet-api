import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchDeliveryPersonOrdersUseCase } from './fetch-delivery-person-orders'
import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryDeliveryPersonsRepository } from 'test/repositories/in-memory-delivery-persons-repository'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { makeAddressee } from 'test/factories/make-addressee'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let inMemoryDeliveryPersonsRepository: InMemoryDeliveryPersonsRepository
let sut: FetchDeliveryPersonOrdersUseCase

describe('Fetch Delivery Person Orders', () => {
  beforeEach(() => {
    inMemoryDeliveryPersonsRepository = new InMemoryDeliveryPersonsRepository()
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddresseesRepository,
    )

    sut = new FetchDeliveryPersonOrdersUseCase(inMemoryOrdersRepository)

    inMemoryDeliveryPersonsRepository.items.push(
      makeDeliveryPerson({}, new UniqueEntityID('deliveryPerson-1')),
    )

    inMemoryAddresseesRepository.items.push(
      makeAddressee({}, new UniqueEntityID('addressee-1')),
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          deliveryPersonId: new UniqueEntityID('deliveryPerson-1'),
          addresseeId: new UniqueEntityID('addressee-1'),
        },
        new UniqueEntityID('order-1'),
      ),
    )
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          addresseeId: new UniqueEntityID('addressee-1'),
        },
        new UniqueEntityID('order-2'),
      ),
    )
  })

  it('should be able to fetch delivery person orders', async () => {
    const result = await sut.execute({
      deliveryPersonId: 'deliveryPerson-1',
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders).toMatchObject([
      {
        orderId: new UniqueEntityID('order-1'),
      },
    ])
  })

  it('should be able to fetch paginated delivery person orders', async () => {
    for (let i = 1; i <= 21; i++) {
      inMemoryOrdersRepository.items.push(
        makeOrder({
          deliveryPersonId: new UniqueEntityID('deliveryPerson-1'),
          addresseeId: new UniqueEntityID('addressee-1'),
        }),
      )
    }

    const result = await sut.execute({
      deliveryPersonId: 'deliveryPerson-1',
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(2)
  })

  it('should not be able to fetch orders from another delivery person', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          deliveryPersonId: new UniqueEntityID('deliveryPerson-2'),
          addresseeId: new UniqueEntityID('addressee-1'),
        },
        new UniqueEntityID('order-3'),
      ),
    )

    const result = await sut.execute({
      deliveryPersonId: 'deliveryPerson-1',
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders).toMatchObject([
      { orderId: new UniqueEntityID('order-1') },
    ])
  })
})
