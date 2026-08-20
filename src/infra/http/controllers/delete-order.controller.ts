import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteOrderUseCase } from '@/domain/orders/application/use-cases/delete-order'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/orders/')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  async handle(@Param('id') orderId: string) {
    const result = await this.deleteOrder.execute({
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
  }
}
