import { z } from 'zod'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchNearbyOrdersUseCase } from '@/domain/orders/application/use-cases/fetch-nearby-orders'
import { NearbyOrderPresenter } from '../presenters/nearby-order-presenter'

const fetchNearbyOrdersQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  page: z.coerce.number().min(1).optional().default(1),
})

const queryValidationPipe = new ZodValidationPipe(fetchNearbyOrdersQuerySchema)

type FetchNearbyOrdersQuerySchema = z.infer<typeof fetchNearbyOrdersQuerySchema>

@Controller('/orders/nearby')
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchNearbyOrdersQuerySchema,
  ) {
    const { latitude, longitude, page } = query

    const result = await this.fetchNearbyOrders.execute({
      latitude,
      longitude,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { orders: result.value.orders.map(NearbyOrderPresenter.toHTTP) }
  }
}
