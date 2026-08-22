import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetOrderUseCase } from '@/domain/orders/application/use-cases/get-order-by-id'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { OrderDetailsPresenter } from '../presenters/order-details-presenter'
import { Roles } from '@/infra/auth/roles'

@Controller('/orders/')
@Roles('ADMIN')
export class GetOrderByIdController {
  constructor(private getOrderById: GetOrderUseCase) {}

  @Get(':id')
  async handle(@Param('id') orderId: string) {
    const result = await this.getOrderById.execute({
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { order: OrderDetailsPresenter.toHTTP(result.value.order) }
  }
}
