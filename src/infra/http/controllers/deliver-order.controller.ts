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
import { DeliverOrderUseCase } from '@/domain/orders/application/use-cases/deliver-order'
import { DeliveryPhotoNotFoundError } from '@/domain/orders/application/use-cases/errors/delivery-photo-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

const deliverOrderBodySchema = z.object({
  deliveryPersonId: z.uuid(),
  deliveryPhotoId: z.uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema)

type DeliverOrderBodySchema = z.infer<typeof deliverOrderBodySchema>

@Controller('/orders')
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch(':id/deliver')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
    @Param('id') orderId: string,
  ) {
    const { deliveryPersonId, deliveryPhotoId } = body

    const result = await this.deliverOrder.execute({
      orderId,
      deliveryPersonId,
      deliveryPhotoId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
        case DeliveryPersonNotFoundError:
        case DeliveryPhotoNotFoundError:
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
