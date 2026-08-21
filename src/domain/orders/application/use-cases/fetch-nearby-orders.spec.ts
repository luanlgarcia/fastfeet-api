import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'
import { makeAddressee } from 'test/factories/make-addressee'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Coordinate } from '../../enterprise/entities/value-objects/coordinate'
import { makeOrder } from 'test/factories/make-order'

let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: FetchNearbyOrdersUseCase

describe('Fetch Nearby Orders', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddresseesRepository,
    )

    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository)

    inMemoryAddresseesRepository.items.push(
      makeAddressee(
        {
          coordinate: Coordinate.create({
            latitude: -23.5613, //Av. Paulista — ~2,9 km
            longitude: -46.6565,
          }),
        },
        new UniqueEntityID('addressee-close'),
      ),
    )
    inMemoryAddresseesRepository.items.push(
      makeAddressee(
        {
          coordinate: Coordinate.create({
            latitude: -22.9068, // Rio de Janeiro — ~360 km
            longitude: -43.1729,
          }),
        },
        new UniqueEntityID('addressee-far'),
      ),
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'WAITING',
          addresseeId: new UniqueEntityID('addressee-close'),
        },
        new UniqueEntityID('order-1'),
      ),
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'WAITING',
          addresseeId: new UniqueEntityID('addressee-far'),
        },
        new UniqueEntityID('order-2'),
      ),
    )
  })

  it('should be able to fetch nearby orders', async () => {
    const result = await sut.execute({
      latitude: -23.5505,
      longitude: -46.6333,
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders).toMatchObject([
      { orderId: new UniqueEntityID('order-1') },
    ])
  })
  it('should not return orders that are not waiting for pickup', async () => {
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'PICKED_UP',
          addresseeId: new UniqueEntityID('addressee-close'),
        },
        new UniqueEntityID('order-3'),
      ),
    )
    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'WAITING',
          addresseeId: new UniqueEntityID('addressee-close'),
        },
        new UniqueEntityID('order-4'),
      ),
    )

    const result = await sut.execute({
      latitude: -23.5505,
      longitude: -46.6333,
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(2)
    expect(result.value?.orders).toMatchObject([
      { orderId: new UniqueEntityID('order-1') },
      { orderId: new UniqueEntityID('order-4') },
    ])
  })
  it('should return orders sorted by distance', async () => {
    inMemoryAddresseesRepository.items.push(
      makeAddressee(
        {
          coordinate: Coordinate.create({
            latitude: -23.587, // Ibirapuera — ~4,8 km
            longitude: -46.6576,
          }),
        },
        new UniqueEntityID('addressee-farther'),
      ),
      makeAddressee(
        {
          coordinate: Coordinate.create({
            latitude: -23.543, // República — ~1,2 km
            longitude: -46.642,
          }),
        },
        new UniqueEntityID('addressee-closest'),
      ),
    )

    inMemoryOrdersRepository.items.push(
      makeOrder(
        {
          status: 'WAITING',
          addresseeId: new UniqueEntityID('addressee-farther'),
        },
        new UniqueEntityID('order-farther'),
      ),
      makeOrder(
        {
          status: 'WAITING',
          addresseeId: new UniqueEntityID('addressee-closest'),
        },
        new UniqueEntityID('order-closest'),
      ),
    )

    const result = await sut.execute({
      latitude: -23.5505,
      longitude: -46.6333,
      page: 1,
    })

    expect(result.value?.orders).toMatchObject([
      { orderId: new UniqueEntityID('order-closest') }, // ~1,2 km
      { orderId: new UniqueEntityID('order-1') }, // ~2,7 km
      { orderId: new UniqueEntityID('order-farther') }, // ~4,8 km
    ])
  })
  it('should be able to fetch paginated nearby orders', async () => {
    for (let i = 1; i <= 21; i++) {
      inMemoryOrdersRepository.items.push(
        makeOrder({
          status: 'WAITING',
          addresseeId: new UniqueEntityID('addressee-close'),
        }),
      )
    }

    const result = await sut.execute({
      latitude: -23.5505,
      longitude: -46.6333,
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(2)
  })
})
