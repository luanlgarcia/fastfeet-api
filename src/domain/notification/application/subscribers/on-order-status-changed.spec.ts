import { InMemoryAddresseesRepository } from 'test/repositories/in-memory-addressees-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { makeAddressee } from 'test/factories/make-addressee'
import { makeOrder } from 'test/factories/make-order'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'
import { OnOrderStatusChanged } from './on-order-status-changed'

let inMemoryAddresseesRepository: InMemoryAddresseesRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<SendNotificationUseCase['execute']>

describe('On Order Status Changed', () => {
  beforeEach(() => {
    inMemoryAddresseesRepository = new InMemoryAddresseesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddresseesRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnOrderStatusChanged(
      inMemoryAddresseesRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification to the addressee when the order status changes', async () => {
    const addressee = makeAddressee()
    const order = makeOrder({ addresseeId: addressee.id })

    inMemoryAddresseesRepository.items.push(addressee)
    await inMemoryOrdersRepository.create(order)

    order.status = 'WAITING'

    await inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: addressee.id.toString(),
          content: 'Sua encomenda está disponível para retirada.',
        }),
      )
    })
  })
})
