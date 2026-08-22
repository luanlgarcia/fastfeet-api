import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchDeliveryPersonOrdersUseCase } from '@/domain/orders/application/use-cases/fetch-delivery-person-orders'
import { FetchDeliveryPersonOrdersPresenter } from '../presenters/fetch-delivery-person-orders-presenter'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/delivery-persons/orders')
export class FetchDeliveryPersonOrdersController {
  constructor(
    private fetchDeliveryPersonOrders: FetchDeliveryPersonOrdersUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchDeliveryPersonOrders.execute({
      deliveryPersonId: user.sub,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      orders: result.value.orders.map(
        FetchDeliveryPersonOrdersPresenter.toHTTP,
      ),
    }
  }
}
