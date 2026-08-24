import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { PostOrderUseCase } from '@/domain/orders/application/use-cases/post-order'
import { OrderNotFoundError } from '@/domain/orders/application/use-cases/errors/order-not-found-error'
import { InvalidOrderStatusError } from '@/domain/orders/application/use-cases/errors/invalid-order-status-error'
import { Roles } from '@/infra/auth/roles'
import { OrderWithoutAddresseeError } from '@/domain/orders/application/use-cases/errors/order-without-addressee-error'

@Controller('/orders')
@Roles('ADMIN')
export class PostOrderController {
  constructor(private postOrder: PostOrderUseCase) {}

  @Patch(':id/post')
  @HttpCode(204)
  async handle(@Param('id') orderId: string) {
    const result = await this.postOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
        case OrderWithoutAddresseeError:
          throw new NotFoundException(error.message)
        case InvalidOrderStatusError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
