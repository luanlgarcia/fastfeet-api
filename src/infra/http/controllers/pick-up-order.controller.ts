import {
  BadRequestException,
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
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/orders')
export class PickUpOrderController {
  constructor(private pickUpOrder: PickUpOrderUseCase) {}

  @Patch(':id/pick-up')
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const result = await this.pickUpOrder.execute({
      orderId,
      deliveryPersonId: user.sub,
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
