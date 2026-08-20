import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { OrderNotFoundError } from '@/domain/orders/application/use-cases/errors/order-not-found-error'
import { InvalidOrderStatusError } from '@/domain/orders/application/use-cases/errors/invalid-order-status-error'
import { DeliveryPersonNotFoundError } from '@/domain/orders/application/use-cases/errors/delivery-person-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ReturnOrderUseCase } from '@/domain/orders/application/use-cases/return-order'

const returnOrderBodySchema = z.object({
  deliveryPersonId: z.uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(returnOrderBodySchema)

type ReturnOrderBodySchema = z.infer<typeof returnOrderBodySchema>

@Controller('/orders')
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch(':id/return')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ReturnOrderBodySchema,
    @Param('id') orderId: string,
  ) {
    const { deliveryPersonId } = body

    const result = await this.returnOrder.execute({
      orderId,
      deliveryPersonId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
        case DeliveryPersonNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        case InvalidOrderStatusError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
