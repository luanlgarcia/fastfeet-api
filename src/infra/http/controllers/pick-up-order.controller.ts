import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { OrderNotFoundError } from '@/domain/orders/application/use-cases/errors/order-not-found-error'
import { InvalidOrderStatusError } from '@/domain/orders/application/use-cases/errors/invalid-order-status-error'
import { PickUpOrderUseCase } from '@/domain/orders/application/use-cases/pick-up-order'
import { DeliveryPersonNotFoundError } from '@/domain/orders/application/use-cases/errors/delivery-person-not-found-error'

const pickUpOrderBodySchema = z.object({
  deliveryPersonId: z.uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(pickUpOrderBodySchema)

type PickUpOrderBodySchema = z.infer<typeof pickUpOrderBodySchema>

@Controller('/orders')
export class PickUpOrderController {
  constructor(private pickUpOrder: PickUpOrderUseCase) {}

  @Patch(':id/pick-up')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: PickUpOrderBodySchema,
    @Param('id') orderId: string,
  ) {
    const { deliveryPersonId } = body

    const result = await this.pickUpOrder.execute({
      orderId,
      deliveryPersonId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
        case DeliveryPersonNotFoundError:
          throw new NotFoundException(error.message)
        case InvalidOrderStatusError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
